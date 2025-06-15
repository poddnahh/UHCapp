// js/index.js
// ----------------------------------------------------------------------------
// Wait for globals.js to parse reportList.json into reportConfig
configReady.then(startup).catch(err => {
  console.error("Failed to load reportList.json:", err);
  $("#overlay").html(`
    <div style="color:red;padding:20px;">
      Failed to load reports:<br>${err.message}
    </div>
  `);
});

function startup() {
  // cache DOM references
  const container   = document.querySelector(".report-container");
  const overlayEl   = $("#overlay");
  const contentEl   = $(".content");
  const dropdownDiv = $(".dropdown");

  // 1) Bootstrap the container
  powerbi.bootstrap(container, { type: "report" });

  // 2) Embed using reportConfig from globals.js
  const models      = window["powerbi-client"].models;
  const embedConfig = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: reportConfig.accessToken,   // null if no token flow
    embedUrl:   reportConfig.embedUrl,
    id:         reportConfig.reportId,
    settings: {
      panes: {
        filters:        { visible: false, expanded: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(container, embedConfig);

  report.on("loaded", () => {
    overlayEl.hide();
    contentEl.show();
    // Default‐select first data‐color
    $("#datacolor0").prop("checked", true);
  });

  report.on("rendered", () => {
    console.log("Report rendered successfully");
  });

  // 3) Build your theme picker UI
  buildThemePalette();

  // 4) Dropdown focus‐management
  dropdownDiv
    .on("hidden.bs.dropdown", () => $(".btn-theme").focus())
    .on("shown.bs.dropdown", () => $("#theme-slider").focus());

  // 5) Prevent dropdown from auto‐closing when clicking inside
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}
