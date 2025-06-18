document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  fetch("./reportList.json")
    .then(response => {
      console.log("reportList.json fetched");
      return response.json();
    })
    .then(reports => {
      if (!reports || reports.length === 0) {
        console.error("No reports found in reportList.json");
        return;
      }

      const report = reports[0]; // Load first report
      console.log("Using report URL:", report.url);

      const reportContainer = document.getElementById("report-container");
      if (!reportContainer) {
        console.error("report-container not found");
        return;
      }

      const iframe = document.createElement("iframe");
      iframe.src = report.url;
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      iframe.allowFullscreen = true;

      reportContainer.appendChild(iframe);

      // Optional: hide loading overlay
      const overlay = document.getElementById("overlay");
      if (overlay) overlay.style.display = "none";
    })
    .catch(error => {
      console.error("Error loading or parsing reportList.json:", error);
    });
});
