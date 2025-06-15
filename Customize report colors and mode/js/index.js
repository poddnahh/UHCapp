// index.js
// ----------------------------------------------------------------------------
// “Customize report colors & mode” page logic
// ----------------------------------------------------------------------------

// State & keys
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB = 9;
const Keys = { TAB: "Tab" };

// Cache DOM
const dropdownDiv = $(".dropdown");
const themesList  = $("#theme-dropdown");
const overlay     = $("#overlay");
const content     = $(".content");
const embedDiv    = $(".report-container").get(0);

// Once globals.js has given us reportConfig…
configReady.then(startup);

function startup() {
  // Bootstrap (no accessToken/tokenType when embedding interactive)
  powerbi.bootstrap(embedDiv, { type: "report" });

  // Embed now
  embedThemesReport();

  // Build the palette UI
  buildThemePalette();

  // Return focus to button when closed
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
}

// Prevent dropdown auto-close
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Handle Shift+Tab off the slider
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key===Keys.TAB || e.keyCode===KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded","false");
  }
});

async function embedThemesReport() {
  // Wait for session_utils to fetch anything needed (mostly no-op here)
  await loadThemesShowcaseReportIntoSession();

  // Grab your interactive embed URL
  const embedUrl = reportConfig.embedUrl;

  // Merge default light theme + first data-color
  const defaultThemeJson = $.extend({}, jsonDataColors[0], themes[0]);

  // Build an **interactive** embed config (no tokenType/accessToken)
  const config = {
    type:     "report",
    embedUrl,
    settings: {
      panes: {
        filters:        { visible: false, expanded: false },
        pageNavigation: { visible: false }
      },
      layoutType:   window["powerbi-client"].models.LayoutType.Custom,
      customLayout: { displayOption: window["powerbi-client"].models.DisplayOption.FitToPage },
      background:   window["powerbi-client"].models.BackgroundType.Transparent
    },
    theme: { themeJson: defaultThemeJson }
  };

  // Do the embed
  themesShowcaseState.themesReport = powerbi.embed(embedDiv, config);

  // Once loaded, hide spinner & show content
  themesShowcaseState.themesReport.on("loaded", () => {
    overlay.hide();
    content.show();
    themesList.find("#datacolor0").prop("checked", true);
  });

  // Playground hook (optional)
  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try { window.parent.playground.logShowcaseDoneRendering("CustomizeColors"); } catch {}
  });
}

// buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), applyTheme(), toggleTheme(),
// toggleDarkThemeOnElements() all live in themes.js exactly as before.
