// js/globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// Dynamically loads embedUrl & reportId from this folder’s reportList.json
// ----------------------------------------------------------------------------

const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

;(function loadReportList() {
  // **Point at this folder’s reportList.json**
  fetch("./reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      const params     = new URLSearchParams(window.location.search);
      const reportName = params.get("report");
      let entry = reportName && list.find(r => r.name === reportName);
      if (!entry) entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error("Report not found");
      }
      reportConfig.embedUrl  = entry.embedUrl;
      reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      document.getElementById("overlay").innerHTML = `
        <div style="color:red; padding:20px; font-size:16px;">
          Failed to load report list:<br>${err.message}
        </div>`;
    })
    .finally(() => {
      _configReadyResolve();
    });
})();
