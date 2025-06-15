// js/index.js
// ----------------------------------------------------------------------------
// “Customize report colors & mode” page logic

import { reportConfig, configReady } from "./globals.js";
import { loadThemesShowcaseReportIntoSession } from "./session_utils.js";

const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlayEl      = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

configReady.then(startup);

function startup() {
  const models = window["powerbi-client"].models;
  powerbi.bootstrap(embedContainer, { type: "report" });

  embedThemesReport();
  buildThemePalette();

  dropdownDiv.on("hidden.bs.dropdown",  () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown",   () => $("#theme-slider").focus());
}

async function embedThemesReport() {
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl:   reportConfig.embedUrl,
    id:         reportConfig.reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: { themeJson: $.extend({}, jsonDataColors[0], themes[0]) }
  };

  const embedded = powerbi.embed(embedContainer, config);
  embedded.on("loaded", () => {
    overlayEl.hide();
    contentElement.show();
    themesList.find("#datacolor0").prop("checked", true);
  });
  embedded.on("rendered", () => {
    console.log("Theme report rendered");
    try { window.parent.playground.logShowcaseDoneRendering("CustomizeColors"); } catch {}
  });
}

// buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), onDataColorWrapperClicked(), applyTheme(),
// toggleTheme(), toggleDarkThemeOnElements()  — come **unchanged** from your existing themes.js
