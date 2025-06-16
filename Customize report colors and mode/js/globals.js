// js/globals.js
// ----------------------------------------------------------------------------
// 1) Paste your Publish-to-Web embed URL here:
const EMBED_URL = "https://app.powerbi.com/reportEmbed?reportId=69efae40-1fb2-4f69-936d-4e6d9c6d40fd&autoAuth=true&ctid=ab194e01-6dc7-4c6a-bbb1-68c12c744b97";

// 2) Extract reportId:
const url    = new URL(EMBED_URL);
const REPORT_ID = url.searchParams.get("r");

// 3) Expose global config
window.reportConfig = {
  accessToken: null,    // P2W → no token
  embedUrl:    EMBED_URL,
  reportId:    REPORT_ID
};

// 4) Immediately ready
window.configReady = Promise.resolve();


