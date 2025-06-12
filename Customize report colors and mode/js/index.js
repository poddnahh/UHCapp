// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(document).ready(async function () {
    // 1) Wait for reportConfig (from globals.js) to be populated
    await configReady;

    // 2) Bootstrap the embed container
    powerbi.bootstrap(embedContainer, { type: "report" });

    // 3) Embed the report now that embedUrl & reportId are ready
    embedThemesReport();

    // 4) Build the theme palette (switcher + data-color options)
    buildThemePalette();

    // 5) Cache dynamic elements for dark-mode toggling & focus management
    themeSlider            = $("#theme-slider");
    dataColorNameElements  = $(".data-color-name");
    themeSwitchLabel       = $(".theme-switch-label");
    horizontalSeparator    = $(".dropdown-separator");
    sliderCheckbox         = $(".slider");

    allUIElements = [
      bodyElement, contentElement, dropdownDiv,
      themeContainer, themeSwitchLabel, horizontalSeparator,
      horizontalRule, sliderCheckbox, themeButton,
      themeBucket, dataColorNameElements
    ];

    // 6) Restore focus to the “Choose theme” button when dropdown closes
    dropdownDiv.on("hidden.bs.dropdown", () => {
        themeButton.focus();
    });

    // 7) Send focus into the slider when dropdown opens
    dropdownDiv.on("shown.bs.dropdown", () => {
        themeSlider.focus();
    });
});

// Handle Shift+Tab inside the slider to close the dropdown again
$(document).on("keydown", "#theme-slider", function (e) {
    if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
        dropdownDiv.removeClass("show");
        themesList.removeClass("show");
        themeButton.attr("aria-expanded", "false");
    }
});

// Prevent the dropdown from closing if you click inside one of your custom controls
$(document).on("click", ".allow-focus", function (e) {
    e.stopPropagation();
});

// Set accessibility props on the embedded report
function setReportAccessibilityProps(report) {
    report.setComponentTitle("Playground showcase sample Theme report");
    report.setComponentTabIndex(0);
}

// Embed & configure the Power BI report
async function embedThemesReport() {
    // pull in your session info (workspace/app token, etc.)
    await loadThemesShowcaseReportIntoSession();

    const models        = window["powerbi-client"].models;
    const accessToken   = reportConfig.accessToken;
    const embedUrl      = reportConfig.embedUrl;
    const embedReportId = reportConfig.reportId;
    const permissions   = models.Permissions.View;

    // start with your default light theme + dataColors[0]
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
            layoutType: models.LayoutType.Custom,
            customLayout: { displayOption: models.DisplayOption.FitToPage },
            background:  models.BackgroundType.Transparent
        },
        theme: { themeJson: newTheme }
    };

    themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);
    setReportAccessibilityProps(themesShowcaseState.themesReport);

    // Once loaded, hide the spinner and show your UI
    themesShowcaseState.themesReport.off("loaded");
    themesShowcaseState.themesReport.on("loaded", function () {
        overlay.hide();
        $(".content").show();
        themesList.find("#datacolor0").prop("checked", true);
    });

    // Log when fully rendered
    themesShowcaseState.themesReport.off("rendered");
    themesShowcaseState.themesReport.on("rendered", function () {
        themesShowcaseState.themesReport.off("rendered");
        console.log("The customize colors and mode report rendered successfully");
        try {
            window.parent.playground?.logShowcaseDoneRendering("CustomizeColors");
        } catch { /* no-op */ }
    });
}

// Build your theme switcher + data-color list
function buildThemePalette() {
    buildThemeSwitcher();
    buildSeparator();
    for (let i = 0; i < jsonDataColors.length; i++) {
        themesList.append(buildDataColorElement(i));
    }
}

// (the rest of your DOM-builder and applyTheme/toggleTheme functions stay untouched)
