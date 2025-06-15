// js/index.js
// ----------------------------------------------------------------------------
// Wait until globals.js has loaded reportConfig
window.configReady.then(startup);

function startup() {
  // Cache DOM
  const container   = document.querySelector(".report-container");
  const overlayEl   = document.getElementById("overlay");
  const contentEl   = document.querySelector(".content");
  const dropdownDiv = $(".dropdown");

  // 1) Bootstrap the empty container
  powerbi.bootstrap(container, { type: "report" });

  // 2) Embed the report (using None tokenType)
  embedReport().catch(err => {
    console.error(err);
    overlayEl.innerHTML = `<div style="color:red;padding:20px;">
      Embed failed:<br>${err.message}
    </div>`;
  });

  // 3) Build your theme‐chooser UI
  buildThemePalette();

  // 4) Accessibility / focus management
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}

async function embedReport() {
  const container = document.querySelector(".report-container");
  const models    = window["powerbi-client"].models;

  // Grab embedUrl & reportId from globals.js
  const { embedUrl, reportId } = window.reportConfig;

  if (!embedUrl || !reportId) {
    throw new Error("Missing embedUrl or reportId");
  }

  const config = {
    type:       "report",
    tokenType:  models.TokenType.None,         // ← no token
    embedUrl:   embedUrl,
    id:         reportId,
    settings: {
      panes: {
        filters:         { visible: false },
        pageNavigation:  { visible: false }
      },
      layoutType:    models.LayoutType.Custom,
      customLayout:  { displayOption: models.DisplayOption.FitToPage },
      background:    models.BackgroundType.Transparent
    },
    theme: {
      themeJson: $.extend({}, jsonDataColors[0], themes[0])
    }
  };

  // Embed
  const report = powerbi.embed(container, config);

  // On load: hide spinner, show content
  report.on("loaded", () => {
    document.getElementById("overlay").style.display = "none";
    document.querySelector(".content").style.display = "block";
    $("#theme-dropdown #datacolor0").prop("checked", true);
  });

  report.on("rendered", () => console.log("Report rendered"));
}
