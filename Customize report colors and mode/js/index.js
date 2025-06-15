// js/index.js
// ----------------------------------------------------------------------------
// 1) Wait for globals.js to finish loading reportConfig
window.configReady
  .then(startup)
  .catch(err => {
    console.error("Could not initialize:", err);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Initialization error:<br>${err.message}
      </div>`;
  });

function startup() {
  // cache DOM
  const container   = document.querySelector(".report-container");
  const overlayEl   = document.getElementById("overlay");
  const contentEl   = document.querySelector(".content");
  const dropdownDiv = document.querySelector(".dropdown");

  // 2) Bootstrap the container for a report
  powerbi.bootstrap(container, { type: "report" });

  // 3) Embed the report from your reportConfig
  const models = window["powerbi-client"].models;
  const cfg = {
    type:        "report",
    tokenType:   models.TokenType.Embed,
    accessToken: window.reportConfig.accessToken,   // probably null in your case
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
    // apply the first theme + colors by default
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(container, cfg);

  report.on("loaded", () => {
    overlayEl.style.display = "none";
    contentEl.style.display = "block";
    // select the first color radio
    document.getElementById("datacolor0").checked = true;
  });

  report.on("rendered", () => {
    console.log("Report rendered successfully");
  });

  // 4) Build the color‐chooser UI
  buildThemePalette();

  // 5) Wire up dropdown focus / click behavior
  $(dropdownDiv)
    .on("hidden.bs.dropdown",  () => $(".btn-theme").focus())
    .on("shown.bs.dropdown",   () => $("#theme-slider").focus());

  // prevent dropdown auto‐close when clicking inside
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}
