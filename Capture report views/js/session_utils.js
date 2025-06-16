// ----------------------------------------------------------------------------
// Simplified session_utils.js for PUBLIC Power BI reports via reportList.json
// No authentication or token logic required.
// ----------------------------------------------------------------------------

// Stub function: in the original Microsoft playground, this loaded auth tokens.
// In your version, we don't need this because you're using public "view" links.
function loadSampleReportIntoSession() {
  // Simulate async load for compatibility
  return Promise.resolve();
}

// Set embed config values in global reportConfig (used by index.js)
function setConfig(accessToken, embedUrl, reportId) {
  reportConfig.accessToken = null;       // No token required for public reports
  reportConfig.embedUrl = embedUrl;
  reportConfig.reportId = reportId;
}
