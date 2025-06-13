// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

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

(async function () {
  // 1) Wait for globals.js to finish loading reportConfig
  await configReady;

  // 2) Bootstrap the Power BI embed container
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 3) Embed the report now that reportConfig is set
  await embedThemesReport();

  // 4) Build the theme palette (light/dark toggle + data-color radios)
  buildThemePalette();

  // 5) Cache UI elements for focus & dark-mode toggling
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

  // 6) Restore focus to the button when the dropdown closes
  dropdownDiv.on("hidden.bs.dropdown", () => {
    themeButton.focus();
  });

  // 7) Move focus into the slider when it opens
  dropdownDiv.on("shown.bs.dropdown", () => {
    themeSlider.focus();
  });
})();


// Embed the report and hook up loaded/rendered callbacks
async function embedThemesReport() {
  // Pull in accessToken & embedUrl & reportId from session (session_utils.js)
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const accessToken   = reportConfig.accessToken;
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;
  const permissions   = models.Permissions.View;

  // Merge the default light theme + first data-color set
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

  // Actually perform the embed
  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  // Once loaded, hide spinner & reveal UI
  themesShowcaseState.themesReport.off("loaded");
  themesShowcaseState.themesReport.on("loaded", () => {
    overlay.hide();
    $(".content").show();
    themesList.find("#datacolor0").prop("checked", true);
  });

  // Once rendered, log to parent playground
  themesShowcaseState.themesReport.off("rendered");
  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try {
      window.parent.playground.logShowcaseDoneRendering("CustomizeColors");
    } catch { /* ignore if not in playground */ }
  });
}

// All of your buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), applyTheme(), toggleTheme(), and toggleDarkThemeOnElements()
// remain exactly as you already have them.
