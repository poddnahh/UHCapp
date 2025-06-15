// ----------------------------------------------------------------------------
// index.js for "Customize report colors & mode"
// ----------------------------------------------------------------------------

// 1) reportConfig is populated by globals.js
// 2) We’ll also use this same promise to wait for our local reportList.json load
let _indexReadyResolve;
const indexReady = new Promise(res => { _indexReadyResolve = res; });

// 3) Cache DOM & state — DO NOT REMOVE
const themesShowcaseState = { themesReport: null };
const KEYCODE_TAB         = 9;
const Keys                = { TAB: "Tab" };

const bodyElement    = $("body");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const overlay        = $("#overlay");
const contentElement = $(".content");
const embedContainer = $(".report-container").get(0);

// ----------------------------------------------------------------------------
// Immediately fetch THIS folder's reportList.json and populate reportConfig
// ----------------------------------------------------------------------------
;(function loadReportList() {
  fetch("./reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      // pick by ?report=Name or default to first
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
      overlay.html(`
        <div style="color:red; padding:20px; font-size:16px;">
          Failed to load report list:<br>${err.message}
        </div>`);
    })
    .finally(() => {
      // allow the rest of index.js to run
      _indexReadyResolve();
    });
})();

// ----------------------------------------------------------------------------
// Once reportConfig is ready, bootstrap, embed, build UI, wire focus handlers
// ----------------------------------------------------------------------------
indexReady.then(() => {
  // 1) Bootstrap
  powerbi.bootstrap(embedContainer, { type: "report" });

  // 2) Embed
  embedThemesReport();

  // 3) Build your color/theme UI
  buildThemePalette();

  // 4) Return focus when dropdown closes
  dropdownDiv.on("hidden.bs.dropdown", () => {
    $(".btn-theme").focus();
  });
  // 5) Move focus into slider when opens
  dropdownDiv.on("shown.bs.dropdown", () => {
    $("#theme-slider").focus();
  });
});

// Prevent the dropdown from auto-closing on inner clicks
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Close dropdown when Shift+Tab leaves the slider
$(document).on("keydown", "#theme-slider", e => {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    $(".btn-theme").attr("aria-expanded", "false");
  }
});

// ----------------------------------------------------------------------------
// Embed the report and hide the spinner once loaded
// ----------------------------------------------------------------------------
async function embedThemesReport() {
  // this comes from js/session_utils.js
  await loadThemesShowcaseReportIntoSession();

  const models        = window["powerbi-client"].models;
  const accessToken   = reportConfig.accessToken;
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;

  // default to light + first color set
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
    overlay.hide();
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

// NOTE: your functions buildThemePalette(), buildThemeSwitcher(), buildSeparator(),
// buildDataColorElement(), applyTheme(), toggleTheme(), toggleDarkThemeOnElements()
// all stay exactly as they are in your existing themes.js.
