// ----------------------------------------------------------------------------
// Embed & UI Logic for "Go from Insights to Quick Action"
// ----------------------------------------------------------------------------

$(document).ready(function () {
  // Bootstrap container
  powerbi.bootstrap(embedContainer, { type: "report" });
  // Hide dialogs initially
  distributionDialog.hide(); dialogMask.hide(); sendDialog.hide(); successDialog.hide();
  // Embed once globals.js has populated reportConfig
  // embedReport is your existing function in this file
  embedReport();
  // <rest of your existing dialog handlers…>
});

// Your existing embedReport() function:
async function embedReport() {
  // Load any session utils…
  await loadReportIntoSession(); 

  const models      = window["powerbi-client"].models;
  const permissions = models.Permissions.View;

  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:   reportConfig.embedUrl,
    id:         reportConfig.reportId,
    permissions,
    settings: {
      panes: {
        filters:         { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    },
    extensions: [ /* your existing extension commands… */ ]
  };

  reportShowcaseState.report = powerbi.embed(embedContainer, config);
  setReportAccessibilityProps(reportShowcaseState.report);

  reportShowcaseState.report.off("loaded");
  reportShowcaseState.report.on("loaded", async function () {
    // your existing loaded handler…
    overlay.hide();
    $("#main-div").show();
  });

  reportShowcaseState.report.off("rendered");
  reportShowcaseState.report.on("rendered", function () {
    console.log("Report rendered");
    // your existing rendered logic…
  });

  // your existing buttonClicked, commandTriggered, etc…
}

// <rest of your existing index.js code…>
