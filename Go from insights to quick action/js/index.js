// Load Power BI report from reportList.json
$(async function () {
  const reportContainer = document.getElementById("report-container");
  powerbi.bootstrap(reportContainer, { type: "report" });

  try {
    const response = await fetch("reportList.json");
    const reportList = await response.json();
    const report = reportList[0];

    const config = {
      type: "report",
      tokenType: models.TokenType.Embed, // works for public reports too
      embedUrl: report.embedUrl,
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
  } catch (error) {
    console.error("Error loading report:", error);
  }
});
