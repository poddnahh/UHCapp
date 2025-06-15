// js/globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors & mode"
// ----------------------------------------------------------------------------

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// DOM & state caches (do not remove)
const themesShowcaseState = { themesArray: null, themesReport: null };
const bodyElement    = $("body");
const overlay        = $("#overlay");
const dropdownDiv    = $(".dropdown");
const themesList     = $("#theme-dropdown");
const contentElement = $(".content");
const themeContainer = $(".theme-container");
const horizontalRule = $(".horizontal-rule");
const themeButton    = $(".btn-theme");
const themeBucket    = $(".bucket-theme");
const embedContainer = $(".report-container").get(0);

// Keys
const KEYCODE_TAB = 9;
const Keys = Object.freeze({ TAB: "Tab", ESCAPE: "Escape" });

;(function loadReportConfig() {
  // Directly fetch the local reportList.json
  fetch("reportList.json")
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(list => {
      // pick the first entry
      const entry = Array.isArray(list) && list[0];
      if (!entry || !entry.embedUrl) throw new Error("No report found in reportList.json");
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
      // if you need an access token, you'd set reportConfig.accessToken here too
    })
    .catch(err => {
      console.error("Failed to load reportList.json:", err);
      overlay.html(`
        <div style="color:red;padding:20px;">
          Failed to load report list:<br>${err.message}
        </div>
      `);
    })
    .finally(() => {
      // always proceed, even on error
      _configReadyResolve();
    });
})();
