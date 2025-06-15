// js/index.js
// ----------------------------------------------------------------------------
// Wrap everything in configReady to guarantee reportConfig is present

window.configReady.then(startup);

function startup() {
  // cache DOM
  const container     = document.querySelector(".report-container");
  const overlayEl     = $("#overlay");
  const contentEl     = $(".content");
  const dropdownDiv   = $(".dropdown");
  const themesList    = $("#theme-dropdown");

  // 1) bootstrap the empty container
  powerbi.bootstrap(container, { type: "report" });

  // 2) embed the report
  embedThemesReport().catch(console.error);

  // 3) build your theme‐chooser UI
  buildThemePalette();

  // 4) focus management
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());

  // prevent auto‐close on inner clicks
  $(document).on("click", ".allow-focus", e => e.stopPropagation());
}

async function embedThemesReport() {
  // ensure tokens are loaded
  await loadThemesShowcaseReportIntoSession();

  const models = window["powerbi-client"].models;
  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:   reportConfig.embedUrl,
    id:         reportConfig.reportId,
    settings: {
      panes: { filters:{visible:false}, pageNavigation:{visible:false} },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(
    document.querySelector(".report-container"),
    config
  );

  report.on("loaded", () => {
    $("#overlay").hide();
    $(".content").show();
    $("#theme-dropdown #datacolor0").prop("checked", true);
  });

  report.on("rendered", () => {
    console.log("report rendered");
  });

  // store for later theme switching
  window.themesShowcaseState = { themesReport: report };
}
