// ----------------------------- session_utils.js -----------------------------
// Replaces original embed config loader with dynamic JSON file logic

// Set minutes before the access token should get refreshed (not used for public)
const minutesToRefreshBeforeExpiration = 2;
let tokenExpiration;

// Replace this with logic that loads from reportList.json
async function loadReportIntoSession() {
    const response = await fetch('reportList.json');
    const reportList = await response.json();

    // Check for query string override (e.g., ?report=ProjectSummary3)
    const urlParams = new URLSearchParams(window.location.search);
    const reportName = urlParams.get('report') || reportList[0].name;

    // Find matching report, or fallback to first
    const selectedReport = reportList.find(r => r.name === reportName) || reportList[0];

    // No access token required for public embed links
    setConfig(null, selectedReport.embedUrl, selectedReport.name);
}

function setConfig(accessToken, embedUrl, reportId) {
    reportConfig.accessToken = accessToken;
    reportConfig.embedUrl = embedUrl;
    reportConfig.reportId = reportId;
}
