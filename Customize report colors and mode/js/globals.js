// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// – load same reportList.json from the Go→Insights folder
// ----------------------------------------------------------------------------

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// DOM caches
const overlay        = $("#overlay");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// Build the URL to the Go→Insights folder’s JSON
(function loadReportList() {
  // strip "/Customize report..." from the path
  const base = window.location.pathname.replace(/\/Customize.*$/i, "");
  const jsonUrl = base + "/Go%20from%20insights%20to%20quick%20action/reportList.json";

  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report");
// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// ----------------------------------------------------------------------------

// 1) reportConfig will hold the embedUrl & reportId
const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

// 2) A Promise that we will resolve once reportConfig is ready
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// 3) State & DOM caches — DO NOT REMOVE
const overlay        = $("#overlay");
const embedContainer = $(".report-container").get(0);

// Immediately fetch the *local* reportList.json
(function loadReportConfig() {
  // read ?report=Name if present
  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report") || null;

  fetch("reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      let entry = reportName && list.find(r => r.name === reportName) || list[0];
      if (!entry || !entry.embedUrl) throw new Error("No report found in reportList.json");
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      overlay.html(`
        <div style="color:red;padding:20px;">
          Failed to load report list:<br>${err.message}
        </div>`);
    })
    .finally(() => {
      // Let index.js proceed
      _configReadyResolve();
    });
})();

  fetch(jsonUrl)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      let entry = reportName && list.find(r => r.name === reportName) || list[0];
      if (!entry) throw new Error("No matching report in JSON");
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      overlay.html(`<div style="color:red;padding:20px;">Failed to load report list:<br>${err.message}</div>`);
    })
    .finally(() => {
      _configReadyResolve();
    });
})();
