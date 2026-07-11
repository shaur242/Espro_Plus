/**
 * ============================================
 * ESPro+ — Student Profile Sync (one-time)
 * sync.js
 * ============================================
 * Scrapes the student's profile (name, roll number, course, university email)
 * ONCE per browser install and stores it in Supabase. Independent of the
 * attendance-page injection logic in content.js — runs on whatever page
 * the profile section appears on.
 */

(function () {

  function getProfileData() {
    const heading = document.querySelector('#profile-heading');
    if (!heading) return null;

    const wrapper = heading.parentElement;

    // Chip next to the name — ASSUMED to be roll number.
    const rollNumber = wrapper?.querySelector('.MuiChip-label')?.textContent.trim() || null;

    const name = heading.textContent.trim();

    // The two <p class="MuiTypography-body1"> tags are campus, then course.
    const paragraphs = wrapper
      ? [...wrapper.querySelectorAll('p.MuiTypography-body1')]
      : [];
    const course = (paragraphs[1] || paragraphs[0])?.textContent.trim() || null;

    // Same aria-label pattern parser.js uses for attendance cards
    const contactRegion = document.querySelector('[aria-label^="Student contact summary"]');
    let email = null;
    if (contactRegion) {
      const label = contactRegion.getAttribute('aria-label') || '';
      const match = label.match(/University Email:\s*([^\s,]+)/i);
      email = match ? match[1] : null;
    }

    if (!rollNumber || !name) return null;

    return { roll_number: rollNumber, name, email, course };
  }

  function trySync(retriesLeft = 10) {
    const data = getProfileData();

    if (!data) {
      if (retriesLeft > 0) {
        setTimeout(() => trySync(retriesLeft - 1), 1000);
      } else {
        console.warn('[ESPro+ sync] Profile elements not found on this page — check selectors in sync.js');
      }
      return;
    }

    console.log('[ESPro+ sync] Scraped profile:', data);

    chrome.runtime.sendMessage({ type: 'SYNC_ATTENDANCE', payload: data }, (response) => {
      if (response?.ok) {
        chrome.storage.local.set({ attendanceSynced: true });
        console.log('[ESPro+ sync] One-time profile sync complete:', data.roll_number);
      } else {
        console.error('[ESPro+ sync] Sync failed, will retry on next page load:', response?.error);
      }
    });
  }

  chrome.storage.local.get('attendanceSynced', (result) => {
    if (result.attendanceSynced) {
      console.log('[ESPro+ sync] Already synced once on this device — skipping.');
      return;
    }
    trySync();
  });

})();