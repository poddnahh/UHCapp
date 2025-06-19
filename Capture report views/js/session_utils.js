// Load first report from reportList.json and populate reportConfig
async function loadSampleReportIntoSession() {
  try {
    const response = await fetch("/UHCapp/Capture%20report%20views/reportList.json");
    const reportList = await response.json();

    if (!reportList || reportList.length === 0) {
      console.error("No reports found in reportList.json");
      return;
    }

    const report = reportList[0];
    reportConfig.accessToken = report.accessToken;
    reportConfig.embedUrl = report.embedUrl;
    reportConfig.reportId = report.reportId;
  } catch (err) {
    console.error("Failed to load reportList.json:", err);
  }
}
