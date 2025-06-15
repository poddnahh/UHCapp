// js/globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// Dynamically loads embedUrl & reportId from this folder’s reportList.json
// ----------------------------------------------------------------------------

/** Where we’ll store the embed URL & reportId */
const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

/** Promise we’ll resolve once reportConfig is populated */
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

;(function loadReportList() {
  fetch("./reportList.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(list => {
      // pick by ?report=Name or default to first
      const params     = new URLSearchParams(window.location.search);
      const reportName = params.get("report");
      let entry = reportName && list.find(r => r.name === reportName);
      if (!entry) entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error(`Report not found: ${reportName || (list[0] && list[0].name)}`);
      }

      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      // show error in your overlay
      const overlay = document.getElementById("overlay");
      overlay.innerHTML = `
        <div style="color:red; padding:20px; font-size:16px;">
          Failed to load report list:<br>${err.message}
        </div>`;
    })
    .finally(() => {
      // whether success or error, let index.js proceed
      _configReadyResolve();
    });
})();
