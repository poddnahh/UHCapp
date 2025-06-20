// -----------------------------------------------------------------------------
// Capture Report Views with Embed Token (App Owns Data) - Using reportList.json
// -----------------------------------------------------------------------------

//Added to removed later
function onBookmarkCaptureClicked() {
  console.warn("Bookmark feature not ready yet.");
}
//Removed later end

$(document).ready(function () {
  $("input:text").focus(function () {
    $(this).select();
  });

  $("#save-bookmark-btn").click(onBookmarkCaptureClicked);
  $("#copy-link-btn").click(() => {
    modalButtonClicked(document.getElementById("copy-link-btn"));
    createLink();
  });
  $("#save-view-btn").click(() =>
    modalButtonClicked(document.getElementById("save-view-btn"))
  );
  $("#copy-btn").click(() => copyLink(document.getElementById("copy-btn")));

  $("#modal-action").on("hidden.bs.modal", () => {
    $("#viewname").val("").removeClass("is-invalid");
    $("#copy-link-text").val("");
    $("#copy-link-success-msg").removeClass("visible").addClass("invisible");
    $("#copy-link-btn").removeClass("btn-active");
    $("#save-view-btn").addClass("btn-active");
    $("#copy-btn").removeClass("selected-button").addClass("copy-bookmark");
    $("#capture-view-div").hide();
    $("#tick-icon").hide();
    $("#tick-btn").show();
    $("#save-view-div").show();
    $("#capture-btn").focus();
  });

  fetch("reportList.json")
    .then(response => response.json())
    .then(data => {
      const reportData = data.reports[0]; // Only first report for now
      embedPowerBIReport(reportData);
    })
    .catch(error => {
      console.error("Failed to load report config:", error);
    });
});

function embedPowerBIReport(reportData) {
  const models = window['powerbi-client'].models;

  const config = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: reportData.accessToken,
    embedUrl: reportData.embedUrl,
    id: reportData.reportId,
    permissions: models.Permissions.All,
    settings: {
      panes: {
        filters: { visible: true },
        pageNavigation: { visible: true }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    }
  };

  const reportContainer = document.getElementById("report-container");
  const report = powerbi.embed(reportContainer, config);
  bookmarkShowcaseState.report = report;

  report.setComponentTitle("Capture Report Views");
  report.setComponentTabIndex(0);

  report.on("loaded", async () => {
    const bookmarks = await report.bookmarksManager.getBookmarks();
    createBookmarksList(bookmarks);
    $("#overlay").addClass("invisible");
    $("#main-div").addClass("visible");
  });

  report.on("error", (event) => {
    console.error("Power BI Report Error:", event.detail);
  });
}

// Remaining functions unchanged
