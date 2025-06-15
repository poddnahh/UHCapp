// ----------------------------------------------------------------------------
// js/index.js for "Customize report colors & mode"
// ----------------------------------------------------------------------------

// 1) reportConfig is populated by globals.js
// 2) indexReady lets us wait for that + our local reportList.json
let _indexReadyResolve;
const indexReady = new Promise(res => { _indexReadyResolve = res; });

// 3) Cache DOM & state — DO NOT REMOVE
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB         = 9;
const Keys                = { TAB: "Tab" };

const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlayEl      = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// ----------------------------------------------------------------------------
// Fetch this folder's reportList.json and populate reportConfig
// ----------------------------------------------------------------------------
;(function loadReportList() {
  fetch("./reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      const params     = new URLSearchParams(window.location.search);
      const reportName = params.get("report");
      let entry = reportName && list.find(r => r.name === reportName);
      if (!entry) entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error(`Report not found: ${reportName || list[0].name}`);
      }
      // populate globals.reportConfig
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      overlayEl.html(`
        <div style="color:red; padding:20px; font-size:16px;">
          Failed to load report list:<br>${err.message}
        </div>`);
    })
    .finally(() => {
      // allow indexReady.then() to fire
      _indexReadyResolve();
    });
})();

// ----------------------------------------------------------------------------
// Once reportConfig is ready, bootstrap, embed, build UI, handle focus
// ----------------------------------------------------------------------------
indexReady.then(() => {
  // 1) Bootstrap the container
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 2) Embed the report
  embedThemesReport();

  // 3) Build the theme/color UI palette
  buildThemePalette();

  // 4) Return focus to button when dropdown closes
  dropdownDiv.on("hidden.bs.dropdown", () => {
    $(".btn-theme").focus();
  });
  // 5) Move focus into the slider when dropdown opens
  dropdownDiv.on("shown.bs.dropdown", () => {
    $("#theme-slider").focus();
  });
});

// Prevent dropdown from auto-closing when clicking inside our controls
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Close dropdown when Shift+Tab goes off the slider
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded", "false");
  }
});

// ----------------------------------------------------------------------------
// Embed the report, then hide the spinner and show the UI
// ----------------------------------------------------------------------------
async function embedThemesReport() {
  // Load token/embedUrl/reportId from session_utils.js
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const accessToken   = reportConfig.accessToken;
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;

  // Default to light + first data-color set
  const themeJson = $.extend({}, jsonDataColors[0], themes[0]);

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
      layoutType:  models.LayoutType.Custom,
      customLayout:{ displayOption: models.DisplayOption.FitToPage },
      background:  models.BackgroundType.Transparent
    },
    theme: { themeJson }
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
    } catch { /* ignore */ }
  });
}

// ----------------------------------------------------------------------------
// All of your buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), applyTheme(), toggleTheme(), and
// toggleDarkThemeOnElements() still live unchanged in themes.js
// ----------------------------------------------------------------------------
