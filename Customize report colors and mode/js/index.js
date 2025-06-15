// js/index.js
// ----------------------------------------------------------------------------
// 1) Wait for globals.js to finish loading reportConfig
window.configReady
  .then(startup)
  .catch(err => {
    console.error("Initialization error:", err);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Initialization error:<br>${err.message}
      </div>`;
  });

function startup() {
  const container   = document.querySelector(".report-container");
  const overlayEl   = document.getElementById("overlay");
  const contentEl   = document.querySelector(".content");
  const dropdownDiv = document.querySelector(".dropdown");

  // Bootstrap the empty container
  powerbi.bootstrap(container, { type: "report" });

  // Embed the report from your reportConfig
  const models = window["powerbi-client"].models;
  const cfg = {
    type:        "report",
    tokenType:   models.TokenType.Embed,
    accessToken: window.reportConfig.accessToken,
    embedUrl:    window.reportConfig.embedUrl,
    id:          window.reportConfig.reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(container, cfg);

  report.on("loaded", () => {
    overlayEl.style.display = "none";
    contentEl.style.display = "block";
    // select the first color theme radio
    document.getElementById("datacolor0").checked = true;
  });

  report.on("rendered", () => {
    console.log("Report rendered successfully");
  });

  // Build the chooser UI
  buildThemePalette();

  // Focus management
  $(dropdownDiv)
    .on("hidden.bs.dropdown", () => $(".btn-theme").focus())
    .on("shown.bs.dropdown",  () => $("#theme-slider").focus());

  // Prevent auto‐close on clicks inside
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}
