// js/index.js

// ----------------------------------------------------------------------------
// Embed & UI Logic for "Go from Insights to Quick Action"
// ----------------------------------------------------------------------------

// Wait until globals.js has loaded reportConfig
// `configReady` is the Promise you added there
$(document).ready(async function () {
  await configReady;

  // Bootstrap the embed container
  powerbi.bootstrap(embedContainer, { type: "report" });

  // Hide all dialogs at start
  distributionDialog.hide();
  dialogMask.hide();
  sendDialog.hide();
  successDialog.hide();

  // Now embed the report using your existing function
  embedReport();

  // Your existing dialog handlers (click/focus traps) go here
  closeBtn1.on("click", onCloseClicked);
  closeBtn2.on("click", onCloseClicked);
  successCross.on("click", onCloseClicked);
  sendDiscountBtn.on("click", () => onSendClicked("discount"));
  sendCouponBtn.on("click", () => onSendClicked("coupon"));
  sendMessageBtn.on("click", () => {
    onSendDialogSendClicked();
    setTimeout(() => {
      if (!isDialogClosed) onCloseClicked();
    }, 3000);
  });

  // Focus trapping
  successDialog.on("keydown", e => handleKeyEvents(e, successDialogElements));
  distributionDialog.on("keydown", e => handleKeyEvents(e, distributionDialogElements));
  sendDialog.on("keydown", e => handleKeyEvents(e, sendDialogElements));

  // Select all text on focus
  $(".input-content").focus(function () { $(this).select(); });
});

// ----------------------------------------------------------------------------
// embedReport(): your existing embed logic, unchanged except for using reportConfig
// ----------------------------------------------------------------------------
async function embedReport() {

  // Your existing session utils loader
  await loadReportIntoSession();

  const models      = window["powerbi-client"].models;
  const permissions = models.Permissions.View;

  const config = {
    type:        "report",
    tokenType:   models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:    reportConfig.embedUrl,
    id:          reportConfig.reportId,
    permissions: permissions,
    settings:    {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    },
    extensions: [
      {
        command: {
          name:     "campaign",
          title:    "Start campaign",
          icon:     base64Icon,
          selector: {
            $schema:    "http://powerbi.com/product/schema#visualSelector",
            visualName: TABLE_VISUAL_GUID
          },
          extend: {
            visualOptionsMenu: {
              title:        "Start campaign",
              menuLocation: models.MenuLocation.Top
            }
          }
        }
      }
    ]
  };

  // Embed and wire up events
  reportShowcaseState.report = powerbi.embed(embedContainer, config);
  setReportAccessibilityProps(reportShowcaseState.report);

  reportShowcaseState.report.off("loaded");
  reportShowcaseState.report.on("loaded", async function () {
    // existing load handler
    const pages = await reportShowcaseState.report.getPages();
    const activePage = pages.find(p => p.isActive);
    const visuals = await activePage.getVisuals();
    tableVisual = visuals.find(v => v.name === TABLE_VISUAL_GUID);
    await tableVisual.exportData(models.ExportDataType.Underlying).then(handleExportData);

    overlay.hide();
    $("#main-div").show();
  });

  reportShowcaseState.report.off("rendered");
  reportShowcaseState.report.on("rendered", function () {
    console.log("The go from insights to action report rendered successfully");
    try {
      if (window.parent.playground && window.parent.playground.logShowcaseDoneRendering) {
        window.parent.playground.logShowcaseDoneRendering("InsightToAction");
      }
    } catch {}
  });

  // Button & command triggers
  reportShowcaseState.report.on("buttonClicked", async () => {
    const result = await tableVisual.exportData(models.ExportDataType.Underlying);
    handleExportData(result);
    onStartCampaignClicked();
  });

  reportShowcaseState.report.on("commandTriggered", async event => {
    if (event.detail.command === "campaign") {
      const result = await tableVisual.exportData(models.ExportDataType.Underlying);
      handleExportData(result);
      onStartCampaignClicked();
    }
  });
}

// …the rest of your existing helper functions (handleExportData, onSendClicked, etc.) unchanged…
