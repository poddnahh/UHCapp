// index.js

$(document).ready(function () {
  powerbi.bootstrap($("#report-container").get(0), { type: "report" });
  embedReport();
});

async function embedReport() {
  const response = await fetch("reportList.json");
  const reports = await response.json();

  const firstReport = reports[0];
  const embedUrl = firstReport.embedUrl;

  const models = window["powerbi-client"].models;

  const config = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: null,
    embedUrl: embedUrl,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToWidth
      }
    }
  };

  const reportContainer = $("#report-container").get(0);
  powerbi.embed(reportContainer, config);
}
