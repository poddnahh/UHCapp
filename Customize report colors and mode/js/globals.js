// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json and pluck out the first entry
// (or report matching ?report=Name).

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };
let _configReady;
const configReady = new Promise(res => { _configReady = res; });

(async function loadReportConfig() {
  try {
    // reportList.json is right next to index.html
    const r = await fetch("reportList.json");
    const list = await r.json();

    // allow ?report=Name override
    const params = new URLSearchParams(window.location.search);
    const name   = params.get("report");
    const entry  = name
      ? list.find(x => x.name === name)
      : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry");
    }

    reportConfig.embedUrl = entry.embedUrl;
    reportConfig.reportId = new URL(entry.embedUrl)
                             .searchParams
                             .get("reportId");
  }
  catch (e) {
    console.error("Could not load reportList.json:", e);
    document
      .getElementById("overlay")
      .innerHTML = `<div style="color:red;padding:20px;">
        Failed to load reports:<br>${e.message}
      </div>`;
  }
  finally {
    _configReady();
  }
})();
