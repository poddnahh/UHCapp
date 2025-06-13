// js/globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Customize report colors and mode"
// - Re‐uses the shared reportList.json from the Go from insights… folder
// ----------------------------------------------------------------------------

// 1) reportConfig holds your embedUrl & reportId
const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

// 2) A Promise that signals when reportConfig is ready
let _configReadyResolve;
const configReady = new Promise(res => { _configReadyResolve = res; });

// 3) Your existing DOM & state caches (do not alter)
const themesShowcaseState = { themesReport: null };
const overlay        = $("#overlay");
const embedContainer = $(".report-container").get(0);

// 4) Immediately fetch the JSON from the sibling folder
;(function loadReportConfig() {
  // Derive the base folder (strip “/Customize report colors…”)
  const base = window.location.pathname.replace(
    /\/Customize%20report%20colors%20and%20mode\/.*$/,
    ""
  );

  // Point at the Go from insights… folder
  const jsonUrl = base + "/Go%20from%20insights%20to%20quick%20action/reportList.json";

  // Optionally read ?report=name
  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report");

  fetch(jsonUrl)
    .then(r => r.ok ? r.json() : Promise.reject(r.status))
    .then(list => {
      // Pick by name or default to first
      const entry = (reportName && list.find(r=>r.name===reportName)) || list[0];
      if (!entry?.embedUrl) throw new Error("No report entry found");
      reportConfig.embedUrl  = entry.embedUrl;
      reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get("reportId");
    })
    .catch(err => {
      console.error("reportList.json load failed:", err);
      overlay.html(`
        <div style="color:red;padding:20px;">
          Failed to load report list:<br>${err}
        </div>
      `);
    })
    .finally(() => _configReadyResolve());
})();
