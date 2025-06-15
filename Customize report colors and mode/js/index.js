// js/index.js
// ----------------------------------------------------------------------------
// “Customize report colors & mode” page logic
// ----------------------------------------------------------------------------

// shorthand state & key constants
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB         = 9;
const Keys = { TAB: "Tab", ESCAPE: "Escape" };

// cache common DOM elements
const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlayEl      = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// once globals.js has populated `reportConfig`, start up
configReady.then(startup);

function startup() {
  // 1) Bootstrap the container
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 2) Embed the report
  embedThemesReport();

  // 3) Build the light/dark + data‐color palette UI
  buildThemePalette();

  // 4) Focus management for the dropdown
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
}

// prevent the dropdown from closing when clicking inside our custom controls
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// handle Shift+Tab off the slider to close the dropdown
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded", "false");
  }
});

async function embedThemesReport() {
  // get token/embedUrl/reportId via session_utils.js
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const accessToken   = reportConfig.accessToken;   // if you’re using tokens
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;

  // default to light theme + first data‐color set
  const defaultThemeJson = $.extend({}, jsonDataColors[0], themes[0]);

  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken,
    embedUrl,
    id:         embedReportId,
    settings: {
      panes: {
        filters:        { visible: false, expanded: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: defaultThemeJson }
  };

  // do the embed
  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  // once loaded, hide spinner & show UI
  themesShowcaseState.themesReport.on("loaded", () => {
    overlayEl.hide();
    contentElement.show();
    themesList.find("#datacolor0").prop("checked", true);
  });

  // for Playground integration (optional)
  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try {
      window.parent.playground.logShowcaseDoneRendering("CustomizeColors");
    } catch { /* swallow if not present */ }
  });
}

// (All of your buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
//  buildDataColorElement(), applyTheme(), toggleTheme(),
//  toggleDarkThemeOnElements() remain **exactly** as you have them in themes.js)
