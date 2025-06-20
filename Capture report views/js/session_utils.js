// Load report config from reportList.json (first entry)
async function loadSampleReportIntoSession() {
  const response = await fetch("/UHCapp/Capture%20report%20views/reportList.json");
  const data = await response.json();

  if (!data || !data.length) {
    console.error("No report data found.");
    return;
  }

  const first = data[0];

  reportConfig.accessToken = first.accessToken;
  reportConfig.embedUrl = first.embedUrl;
  reportConfig.reportId = first.reportId;
}

