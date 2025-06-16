// Load reportList.json and embed the first public view report using iframe
fetch("reportList.json")
  .then(response => response.json())
  .then(reports => {
    if (!reports || reports.length === 0) {
      console.error("No reports found in reportList.json");
      return;
    }

    const firstReportUrl = reports[0].embedUrl;
    const iframe = document.getElementById("reportContainer");
    iframe.src = firstReportUrl;
  })
  .catch(error => {
    console.error("Failed to load report list", error);
  });
