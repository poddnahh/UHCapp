// js/index.js
// ----------------------------------------------------------------------------
// “Customize report colors & mode” page logic

const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB         = 9;
const Keys = { TAB: "Tab", ESCAPE: "Escape" };

// cache DOM
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlayEl      = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

configReady.then(startup);

function startup() {
  powerbi.bootstrap(embedContainer, { type: "report" });
  embedThemesReport();
  buildThemePalette();

  dropdownDiv.on("hidden.bs.dropdown", () => $(".btn-theme").focus());
  dropdownDiv.on("shown.bs.dropdown", () => $("#theme-slider").focus());
}

$(document).on("click", ".allow-focus", e => e.stopPropagation());
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded", "false");
  }
});

async function embedThemesReport() {
  await loadThemesShowcaseReportIntoSession();

  const models = window["powerbi-client"].models;
  const accessToken = reportConfig.accessToken;
  const embedUrl    = reportConfig.embedUrl;
  const id          = reportConfig.reportId;

  // start with light theme + first data-color
  const defaultTheme = $.extend({}, jsonDataColors[0], themes[0]);

  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken,
    embedUrl,
    id,
    settings: {
      panes: { filters:{visible:false}, pageNavigation:{visible:false} },
      layoutType: models.LayoutType.Custom,
      customLayout:{ displayOption: models.DisplayOption.FitToPage },
      background: models.BackgroundType.Transparent
    },
    theme: { themeJson: defaultTheme }
  };

  themesShowcaseState.themesReport = powerbi.embed(embedContainer, config);

  themesShowcaseState.themesReport.on("loaded", () => {
    overlayEl.hide();
    contentElement.show();
    themesList.find("#datacolor0").prop("checked", true);
  });

  themesShowcaseState.themesReport.on("rendered", () => {
    console.log("Customize Colors report rendered");
    try {
      window.parent.playground.logShowcaseDoneRendering("CustomizeColors");
    } catch {}
  });
}
