// Ensure the Power BI Client API is ready
const models = window['powerbi-client'].models;

// Get the embed container
const embedContainer = document.getElementById("report-container");

// Clear any existing reports
powerbi.reset(embedContainer);

// Load the report list and embed the first one
fetch("reportList.json")
  .then(response => response.json())
  .then(reportList => {
    if (!reportList || reportList.length === 0) {
      console.error("No reports found in reportList.json");
      return;
    }

    const firstReport = reportList[0];

    const config = {
      type: "report",
      tokenType: models.TokenType.Embed, // Use Embed type for public links
      accessToken: null,                 // Public links don't need a token
      embedUrl: firstReport.embedUrl,
      id: null, // Not required for public view links
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

    powerbi.embed(embedContainer, config);
  })
  .catch(error => {
    console.error("Failed to load reportList.json or embed report:", error);
  });
