// globals.js
// ----------------------------------------------------------------------------
// Loads the same reportList.json from the *Go from insights…* folder
// ----------------------------------------------------------------------------

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

// resolve() when JSON load+parse is done
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

;(function loadReportConfig() {
  // build a path back up into the other folder
  const basePath = window.location.pathname.replace(/\/Customize%20report.*$/,'');
  const jsonUrl  = `${basePath}/Go%20from%20insights%20to%20quick%20action/reportList.json`;

  // pick ?report=name if present
  const params = new URLSearchParams(window.location.search);
  const reportName = params.get('report');

  fetch(jsonUrl)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      let entry = reportName && list.find(r=>r.name===reportName);
      if (!entry) entry = list[0];
      if (!entry || !entry.embedUrl) throw new Error('No report found');
      reportConfig.embedUrl  = entry.embedUrl;
      reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get('reportId');
    })
    .catch(err => {
      console.error('reportList.json load failed:', err);
      $('#overlay').html(`<div style="color:red;padding:20px;">Failed to load report list:<br>${err.message}</div>`);
    })
    .finally(() => _configReadyResolve());
})();
