// js/index.js
// ----------------------------------------------------------------------------
// Wait until reportConfig (from reportList.json) is loaded
window.configReady.then(startup);

function startup() {
  // Cache DOM elements
  const container   = document.querySelector(".report-container");
  const overlay     = document.getElementById("overlay");
  const content     = document.querySelector(".content");
  const dropdownDiv = document.querySelector(".dropdown");

  // 1) Bootstrap the empty container for Power BI
  powerbi.bootstrap(container, { type: "report" });

  // 2) Embed the report using reportConfig from globals.js
  const models = window["powerbi-client"].models;
  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken:null,                         // Publish-to-web doesn't require a token
    embedUrl:   window.reportConfig.embedUrl, // set in globals.js
    id:         window.reportConfig.reportId, // set in globals.js
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
      // apply the first (Default) palette on load
      themeJson: Object.assign({}, jsonDataColors[0], themes[0])
    }
  };

  const report = powerbi.embed(container, config);

  report.on("loaded", () => {
    overlay.style.display = "none";
    content.style.display = "";
    // pre-select the first palette radio
    document.querySelector("#datacolor0").checked = true;
  });

  report.on("rendered", () => console.log("Report rendered"));

  // 3) Build the “Choose theme” palette
  buildThemePalette();

  // 4) Accessibility / focus management for dropdown
  dropdownDiv.addEventListener("shown.bs.dropdown", () => {
    document.getElementById("theme-slider").focus();
  });
  dropdownDiv.addEventListener("hidden.bs.dropdown", () => {
    document.querySelector(".btn-theme").focus();
  });
  // prevent dropdown from closing when interacting inside
  document.addEventListener("click", e => {
    if (e.target.closest(".allow-focus")) e.stopPropagation();
  });

  // keep a reference if needed later for theme switching
  window.themesShowcaseState = { report };
}
