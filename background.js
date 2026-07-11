// background.js
// Receives scraped student data from content.js and inserts it into Supabase.
// Runs here (not in content.js) so the fetch isn't subject to the portal
// page's own Content-Security-Policy.

const SUPABASE_URL = 'https://uvepyszisdvguftizllc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2ZXB5c3ppc2R2Z3VmdGl6bGxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDY5NjYsImV4cCI6MjA5OTA4Mjk2Nn0.XvnPL_A2phU-gDr76_dG905uBOAkM0pi57uNHg3DlZo'; 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'SYNC_ATTENDANCE') return;

  syncToSupabase(message.payload)
    .then(() => sendResponse({ ok: true }))
    .catch((err) => sendResponse({ ok: false, error: err.message }));

  // Keep the message channel open for the async response above
  return true;
});

async function syncToSupabase(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      ...payload,
      last_synced: new Date().toISOString()
    })
  });

  // If a student already exists in the DB, Supabase returns a 409 Conflict.
  // We check for 409 and treat it as a success so the extension doesn't log errors.
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Supabase sync failed (${res.status}): ${text}`);
  }
}