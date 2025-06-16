// js/index.js
// ----------------------------------------------------------------------------
window.configReady.then(startup);

function startup() {
  // DOM refs
  const container   = document.querySelector(".report-container");
  const overlay     = document.getElementById("overlay");
  const content     = document.querySelector(".content");
  const dropdownDiv = document.querySelector(".dropdown");

  // Bootstrap container
  powerbi.bootstrap(container, { type: "report" });

  // Embed config
  const models = window["powerbi-client"].models;
  const cfg = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: window.reportConfig.accessToken,
    embedUrl:    window.reportConfig.embedUrl,
    id:          window.reportConfig.reportId,
    settings:    {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: {
      // apply “Default / Light” on load:
      themeJson: Object.assign({}, jsonDataColors[0], themes[0])
    }
  };

  const report = powerbi.embed(container, cfg);

  // hide spinner once report is loaded
  report.on("loaded", () => {
    overlay.style.display = "none";
    content.style.display = "";
    document.getElementById("datacolor0").checked = true;
  });

  // build the palette radios
  buildThemePalette();

  // wire up theme‐change events
  document.getElementById("theme-slider")
    .addEventListener("change", applyTheme);

  document.querySelectorAll("input[name=data-color]").forEach(el =>
    el.addEventListener("change", applyTheme)
  );

  async function applyTheme() {
    const colorId = Number(
      document.querySelector("input[name=data-color]:checked").id.slice(-1)
    );
    const modeId = document.getElementById("theme-slider").checked ? 1 : 0;

    // merge palette + background mode
    const newTheme = Object.assign(
      {}, jsonDataColors[colorId], themes[modeId]
    );

    await report.applyTheme({ themeJson: newTheme });
  }
}
