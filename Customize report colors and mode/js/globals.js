// js/globals.js
// ----------------------------------------------------------------------------
const reportConfig = { accessToken: null, embedUrl: null, reportId: null };
let _configReadyResolve;
const configReady = new Promise(res => _configReadyResolve = res);

const overlay        = $("#overlay");
const dropdownDiv    = $(".theme-dropdown");
const themesList     = $("#theme-dropdown");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// Fetch your local reportList.json
;(function loadReportConfig() {
  fetch("reportList.json")
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(list => {
      const entry = Array.isArray(list) && list[0];
      if (!entry || !entry.embedUrl) throw new Error("No report found");
      reportConfig.embedUrl  = entry.embedUrl;
      reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get("reportId");
      // If you use tokens, also set reportConfig.accessToken here
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      overlay.html(`<div style="color:red;padding:20px;">Failed to load report list:<br>${err.message}</div>`);
    })
    .finally(() => _configReadyResolve());
})();
