// Simple embed: load first report from reportList.json
$(document).ready(() => {
  fetch("reportList.json")
    .then(response => response.json())
    .then(reports => {
      if (!reports || reports.length === 0) {
        alert("No reports found.");
        return;
      }

      const firstReport = reports[0];
      embedReport(firstReport.embedUrl);
    })
    .catch(err => console.error("Failed to load report list", err));
});

function embedReport(embedUrl) {
  const models = window['powerbi-client'].models;

  const reportContainer = document.getElementById("report-container");

  const config = {
    type: "report",
    embedUrl: embedUrl,
    tokenType: models.TokenType.Aad,
    accessToken: null,
    permissions: models.Permissions.All,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth
      }
    }
  };

  powerbi.embed(reportContainer, config);
  document.getElementById("overlay").style.display = "none";
  document.getElementById("main-div").style.display = "block";
}
