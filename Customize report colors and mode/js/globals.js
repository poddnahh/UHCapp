// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// ----------------------------------------------------------------------------

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

const overlay        = $("#overlay");
const embedContainer = $(".report-container").get(0);

;(function loadReportConfig() {
  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report") || null;

;(function loadReportConfig() {
  fetch("reportList.json")
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(list => {
      // pick list[0] etc...
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      overlay.html(`<div style="color:red;padding:20px;">
        Failed to load report list:<br>${err.message}
      </div>`);
    })
    .finally(() => _configReadyResolve());
})();
