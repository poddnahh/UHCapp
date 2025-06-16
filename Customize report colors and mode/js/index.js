// js/index.js
// ----------------------------------------------------------------------------
// Wait until window.reportConfig is ready:
window.configReady.then(startup);

function startup() {
  const container   = document.querySelector(".report-container");
  const overlay     = document.getElementById("overlay");
  const content     = document.querySelector(".content");
  const dropdownDiv = document.querySelector(".dropdown");

  // 1) Initialize the empty container
  powerbi.bootstrap(container, { type: "report" });

  // 2) Build the embed config from globals.js
  const models = window["powerbi-client"].models;
  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: window.reportConfig.accessToken,
    embedUrl:   window.reportConfig.embedUrl,
    id:         window.reportConfig.reportId,
    settings: {
      panes: {
        filters:       { visible: false },
        pageNavigation:{ visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: {
      // apply the first palette on load
      themeJson: Object.assign({}, jsonDataColors[0], themes[0])
    }
  };

  // 3) Embed:
  const report = powerbi.embed(container, config);

  report.on("loaded", () => {
    overlay.style.display = "none";
    content.style.display = "";
    document.querySelector("#datacolor0").checked = true;
  });

  report.on("rendered", () => console.log("Report rendered"));

  // 4) Build the “Choose theme” UI:
  buildThemePalette();

  // 5) Dropdown focus management:
  dropdownDiv.addEventListener("shown.bs.dropdown", () => {
    document.getElementById("theme-slider").focus();
  });
  dropdownDiv.addEventListener("hidden.bs.dropdown", () => {
    document.querySelector(".btn-theme").focus();
  });
  document.addEventListener("click", e => {
    if (e.target.closest(".allow-focus")) e.stopPropagation();
  });

  // keep for later if needed:
  window.themesShowcaseState = { report };
}
