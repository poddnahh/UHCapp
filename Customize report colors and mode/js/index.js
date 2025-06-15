// ----------------------------------------------------------------------------
// index.js for "Customize report colors & mode"
// ----------------------------------------------------------------------------

// State & keys
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB = 9;
const Keys = { TAB: "Tab" };

// Cache common elements
const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlay        = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// Wait for globals.js
configReady.then(startup);

function startup() {
  // 1) Bootstrap
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 2) Kick off embedding
  embedThemesReport();

  // 3) Build initial palette UI
  buildThemePalette();

  // 4) Dropdown focus handling
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
}

// Prevent dropdown from auto-closing on inner clicks
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Handle Shift+Tab off the slider
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key===Keys.TAB||e.keyCode===KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded","false");
  }
});

// Embed + show/hide logic
async function embedThemesReport() {
  // 1) Get your embed parameters from session_utils()
  await loadThemesShowcaseReportIntoSession();

  const models      = window["powerbi-client"].models;
  const config = {
    type:      "report",
    tokenType: models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:  reportConfig.embedUrl,
    id:        reportConfig.reportId,
    settings: {
      panes: { filters:{visible:false}, pageNavigation:{visible:false} },
      layoutType: models.LayoutType.Custom,
      customLayout:{displayOption: models.DisplayOption.FitToPage},
      background: models.BackgroundType.Transparent
    },
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  themesShowcaseState.themesReport.on("loaded", () => {
    overlay.hide();
    contentElement.show();
    themesList.find("#datacolor0").prop("checked",true);
  });

  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try { window.parent.playground.logShowcaseDoneRendering("CustomizeColors"); } catch {}
  });
}

// (buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
//  buildDataColorElement(), applyTheme(), toggleTheme(),
//  toggleDarkThemeOnElements() — all remain exactly as you already have them in themes.js)
