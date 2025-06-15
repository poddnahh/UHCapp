// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json and pluck out the first entry
// (or one matching ?report=Name).

export const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReady;
export const configReady = new Promise(r => { _configReady = r; });

;(async function loadReportConfig() {
  try {
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    const params = new URLSearchParams(window.location.search);
    const name   = params.get("report");
    const entry  = name
      ? list.find(x => x.name === name)
      : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry in reportList.json");
    }

    reportConfig.embedUrl  = entry.embedUrl;
    reportConfig.reportId = new URL(entry.embedUrl)
                              .searchParams
                              .get("reportId");
  }
  catch(e) {
    console.error("Could not load reportList.json:", e);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
  }
  finally {
    _configReady();
  }
})();
