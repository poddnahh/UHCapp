// ----------------------------------------------------------------------------
// globals.js  — Load YOUR reportList.json from THIS folder
// ----------------------------------------------------------------------------

// Will hold embedUrl & reportId
const reportConfig = {
  embedUrl: null,
  reportId: null
};

// Signal that config is ready
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// Immediately load the local reportList.json
;(function loadReportConfig() {
  fetch("reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(list => {
      // pick the first report
      const entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error("No valid embedUrl in reportList.json");
      }

      reportConfig.embedUrl  = entry.embedUrl;
      // extract reportId just in case you need it later
      reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("Failed to load reportList.json:", err);
      // show something in place of spinner
      document.getElementById("overlay").innerHTML =
        `<div style="color:red;padding:20px;">Error loading report list:<br>${err.message}</div>`;
    })
    .finally(() => {
      _configReadyResolve();
    });
})();
