// Simple embed: load first report from reportList.json
$(document).ready(() => {
  fetch("https://poddnahh.github.io/UHCapp/reportList.json")
    .then(response => response.json())
    .then(reports => {
      if (!reports || reports.length === 0) {
        alert("No reports found.");
        return;
      }

      const firstReport = reports[0].url;
      const iframe = document.getElementById("reportContainer");

      iframe.src = firstReport;

      iframe.onload = () => {
        document.getElementById("overlay").style.display = "none";
      };
    })
    .catch(err => {
      console.error("Failed to load report list", err);
      document.getElementById("spinner").textContent = "Failed to load report.";
    });
});
