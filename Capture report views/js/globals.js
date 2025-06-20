// Minimal globals for capture report views sample

let reportConfig = {
  accessToken: null,
  embedUrl: null,
  reportId: null,
  type: "report"
};

let bookmarkShowcaseState = {
  report: null,
  bookmarks: [],
  bookmarkCounter: 1
};

const overlay = $('#overlay');
const reportContainer = $('#report-container').get(0);
const bookmarkContainer = $('#bookmark-container')?.get(0);  // for share_bookmark.html

// Used for parsing shared bookmark ID from URL
const regex = new RegExp('[?&]id(=([^&#]*)|&|#|$)');

// Load report settings from reportList.json on page load
async function loadSampleReportIntoSession() {
  try {
    const response = await fetch("reportList.json");
    const reports = await response.json();

    if (Array.isArray(reports) && reports.length > 0) {
      const selectedReport = reports[0];

      reportConfig.accessToken = selectedReport.accessToken;
      reportConfig.embedUrl = selectedReport.embedUrl;
      reportConfig.reportId = selectedReport.reportId;
    } else {
      console.error("No reports found in reportList.json.");
    }
  } catch (error) {
    console.error("Error loading reportList.json:", error);
  }
}
