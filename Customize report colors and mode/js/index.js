// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// 1) State, keys, and UI element caches
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB         = 9;
const Keys                = Object.freeze({ TAB: "Tab" });

const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlay        = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// 2) Wait for globals.js to finish loading reportConfig
configReady.then(startup);

// 3) Main startup routine
function startup() {
  // 3.1) Power BI bootstrap
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 3.2) Embed the report
  embedThemesReport();

  // 3.3) Build the theme-selector UI
  buildThemePalette();

  // 3.4) Manage dropdown focus
  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown",  () => $("#theme-slider").focus());
}

// 4) Prevent dropdown from closing on inner clicks
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// 5) Close dropdown when Shift+Tab leaves the slider
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded", "false");
  }
});

// 6) Embed the Power BI report, then hide spinner / show content
async function embedThemesReport() {
  // 6.1) Pull in embed parameters (sets reportConfig.accessToken/embedUrl/reportId)
  await loadThemesShowcaseReportIntoSession();

  const models      = window["powerbi-client"].models;
  const config = {
    type:        "report",
    tokenType:   models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:    reportConfig.embedUrl,
    id:          reportConfig.reportId,
    settings: {
      panes: {
        filters:        { expanded: false, visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    // start with light mode + first data-color set
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  // 6.2) Do the embed
  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  // 6.3) When loaded, hide spinner and show UI
  themesShowcaseState.themesReport.on("loaded", () => {
    overlay.hide();
    contentElement.show();
    themesList.find("#datacolor0").prop("checked", true);
  });

  // 6.4) When rendered, log for playground (optional)
  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try {
      window.parent.playground.logShowcaseDoneRendering("CustomizeColors");
    } catch { /* no-op */ }
  });
}

// 7) Everything else—buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
//    buildDataColorElement(), applyTheme(), toggleTheme(), toggleDarkThemeOnElements()
//    live untouched in your existing themes.js file.
