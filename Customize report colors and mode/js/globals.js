// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors and mode"
// ----------------------------------------------------------------------------

// 1) reportConfig will hold the embedUrl & reportId
const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

// 2) A Promise that we will resolve once reportConfig is ready
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// 3) State & DOM caches — DO NOT REMOVE
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

// Key and enum
const KEYCODE_TAB = 9;
const Keys = Object.freeze({ TAB: "Tab", ESCAPE: "Escape" });

// ----------------------------------------------------------------------------
// Immediately fetch the JSON from the same folder as this page and populate reportConfig
// ----------------------------------------------------------------------------
;(function loadReportConfig() {
  // Now pointing at the local reportList.json
  const jsonUrl = "./reportList.json";

  fetch(jsonUrl)
    .then(r => { 
      if (!r.ok) throw new Error(r.status); 
      return r.json(); 
    })
    .then(list => {
      // pick the first entry by default
      const entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error("No valid report entry in reportList.json");
      }
      reportConfig.embedUrl = entry.embedUrl;
      reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      overlay.html(
        `<div style="color:red;padding:20px;">
           Failed to load report list:<br>${err.message}
         </div>`
      );
    })
    .finally(() => {
      // whether success or error, let index.js continue (it will error if config is bad)
      _configReadyResolve();
    });
})();
