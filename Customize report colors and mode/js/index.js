// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Wait for the globals.js loader to finish reading reportList.json
// and populating `reportConfig`
let indexReadyResolve;
const indexReady = new Promise(res => { indexReadyResolve = res; });

(async function () {
  // 1) First, block until globals.js finishes loading reportConfig
  await configReady;

  // 2) Bootstrap the Power BI container
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 3) Embed the report now that reportConfig.embedUrl & reportConfig.reportId are set
  embedThemesReport();

  // 4) Build your theme palette (light/dark toggle + data-color radios)
  buildThemePalette();

  // 5) Cache your dynamic UI elements for focus & toggling
  themeSlider           = $("#theme-slider");
  dataColorNameElements = $(".data-color-name");
  themeSwitchLabel      = $(".theme-switch-label");
  horizontalSeparator   = $(".dropdown-separator");
  sliderCheckbox        = $(".slider");

  allUIElements = [
    bodyElement, contentElement, dropdownDiv,
    themeContainer, themeSwitchLabel, horizontalSeparator,
    horizontalRule, sliderCheckbox, themeButton,
    themeBucket, dataColorNameElements
  ];

  // 6) When the dropdown closes, return focus to the “Choose theme” button
  dropdownDiv.on("hidden.bs.dropdown", () => {
    themeButton.focus();
  });

  // 7) When it opens, push focus into the slider
  dropdownDiv.on("shown.bs.dropdown", () => {
    themeSlider.focus();
  });

  // Signal that index.js has finished startup (if anyone cares)
  indexReadyResolve();
})();

// Prevent dropdown from closing when clicking inside custom controls
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Close the dropdown when Shift+Tab leaves the slider
$(document).on("keydown", "#theme-slider", function (e) {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    themeButton.attr("aria-expanded", "false");
  }
});

// Embed the report and wire up loaded/rendered callbacks
async function embedThemesReport() {
  // Pull in workspace/app token, embedUrl, reportId via session_utils
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const accessToken   = reportConfig.accessToken;
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;
  const permissions   = models.Permissions.View;

  // Merge your default light theme and first data-color set
  let newTheme = {};
  $.extend(newTheme, jsonDataColors[0], themes[0]);

  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken,
    embedUrl,
    id:         embedReportId,
    permissions,
    settings: {
      panes: {
        filters:        { expanded: false, visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: newTheme }
  };

  // Perform the actual embedding
  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  // Accessibility props
  themesShowcaseState.themesReport.off("loaded");
  themesShowcaseState.themesReport.on("loaded", () => {
    // Hide spinner & show your UI
    overlay.hide();
    $(".content").show();
    // Pre-check the first data-color radio
    themesList.find("#datacolor0").prop("checked", true);
  });

  themesShowcaseState.themesReport.off("rendered");
  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try {
      window.parent.playground.logShowcaseDoneRendering("CustomizeColors");
    } catch { /* ignore */ }
  });
}

// The rest of your buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), applyTheme(), toggleTheme(), toggleDarkThemeOnElements()
// remain exactly the same as you had them.
