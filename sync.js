/**
 * ============================================
 * ESPro+ — Student Profile Sync (Until Found)
 * sync.js
 * ============================================
 * Checks the page for profile details every 4 seconds. 
 * Once it successfully finds the data and syncs it to Supabase, 
 * the loop clears itself and stops running.
 */

(function () {

  let syncIntervalId = null;

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

  function runSyncCycle() {
    const data = getProfileData();

    // If data isn't on the current page yet, keep the interval running
    if (!data) {
      console.log('[ESPro+ sync] Profile elements not found yet — waiting for next 4s check...');
      return;
    }

    console.log('[ESPro+ sync] Profile found! Scraped data:', data);

    chrome.runtime.sendMessage({ type: 'SYNC_ATTENDANCE', payload: data }, (response) => {
      if (response?.ok) {
        console.log('[ESPro+ sync] One-time profile sync complete. Stopping interval loop.');
        
        // 🛑 SUCCESS: Clear the interval loop so it stops sending data again
        if (syncIntervalId) {
          clearInterval(syncIntervalId);
        }
      } else {
        console.error('[ESPro+ sync] Sync failed, will retry in 4 seconds:', response?.error);
      }
    });
  }

  // Run immediately on page idle load
  runSyncCycle();

  // Start the 4-second checker loop and save its ID so we can shut it off
  syncIntervalId = setInterval(runSyncCycle, 4000);

})();