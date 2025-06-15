// js/index.js
// ----------------------------------------------------------------------------
// Wait for globals.js to finish loading reportConfig
window.configReady.then(startup);

function startup() {
  // Cache DOM nodes
  const container   = document.querySelector(".report-container");
  const overlayEl   = document.getElementById("overlay");
  const contentEl   = document.querySelector(".content");
  const dropdownDiv = $(".dropdown");

  // 1) Bootstrap an empty Power BI container
  powerbi.bootstrap(container, { type: "report" });

  // 2) Embed our Publish-to-web report
  embedReport().catch(err => {
    console.error("Embed failed:", err);
    overlayEl.innerHTML = `
      <div style="color:red;padding:20px;">
        Embed failed:<br>${err.message}
      </div>`;
  });

  // 3) Build the “Choose theme” UI
  buildThemePalette();

  // 4) Focus management (accessibility)
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}

async function embedReport() {
  const container = document.querySelector(".report-container");
  const models    = window["powerbi-client"].models;

  // ⚠️ Use our global reportConfig — NOT a local `cfg`
  const { embedUrl, reportId } = window.reportConfig;
  if (!embedUrl || !reportId) {
    throw new Error("Missing embedUrl or reportId in reportConfig");
  }

  // Build our embed configuration
  const config = {
    type:       "report",
    tokenType:  models.TokenType.None,         // no token needed for publish-to-web
    embedUrl:   embedUrl,
    id:         reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:    models.LayoutType.Custom,
      customLayout:  { displayOption: models.DisplayOption.FitToPage },
      background:    models.BackgroundType.Transparent
    },
    theme: {
      themeJson: $.extend({}, jsonDataColors[0], themes[0])
    }
  };

  // Actually embed
  const report = powerbi.embed(container, config);

  // When loaded: hide spinner, show content, select first theme
  report.on("loaded", () => {
    overlayEl.style.display = "none";
    contentEl.style.display = "block";
    $("#theme-dropdown #datacolor0").prop("checked", true);
  });

  report.on("rendered", () => console.log("Report rendered"));
}
