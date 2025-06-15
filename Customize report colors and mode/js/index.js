// js/index.js
// ----------------------------------------------------------------------------
// Wait for globals.js to load reportList.json into window.reportConfig
window.configReady.then(startup);

function startup() {
  // cache DOM nodes
  const container   = document.querySelector(".report-container");
  const overlayEl   = document.getElementById("overlay");
  const contentEl   = document.querySelector(".content");
  const dropdownDiv = $(".dropdown");

  // 1) Bootstrap Power BI
  powerbi.bootstrap(container, { type: "report" });

  // 2) Embed the report (using our global reportConfig)
  embedReport().catch(err => {
    console.error("Embed failed:", err);
    overlayEl.innerHTML = `
      <div style="color:red;padding:20px;">
        Embed failed:<br>${err.message}
      </div>`;
  });

  // 3) Build the “Choose theme” dropdown
  buildThemePalette();

  // 4) Accessibility: keep focus inside dropdown
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown",  () => $("#theme-slider").focus());
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}

async function embedReport() {
  const container = document.querySelector(".report-container");
  const models    = window["powerbi-client"].models;

  // ▶️ **Use window.reportConfig**, not `cfg`
  const { embedUrl, reportId } = window.reportConfig;
  if (!embedUrl || !reportId) {
    throw new Error("Missing embedUrl or reportId in reportConfig");
  }

  // Build embed config
  const config = {
    type:       "report",
    tokenType:  models.TokenType.None,        // publish-to-web needs no token
    embedUrl:   embedUrl,
    id:         reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: {
      // start with light/default theme
      themeJson: $.extend({}, jsonDataColors[0], themes[0])
    }
  };

  // Do the embed
  const report = powerbi.embed(container, config);

  report.on("loaded", () => {
    overlayEl.style.display = "none";
    contentEl.style.display = "block";
    // mark the first palette item checked
    $("#theme-dropdown #datacolor0").prop("checked", true);
  });

  report.on("rendered", () => console.log("Report rendered"));
}
