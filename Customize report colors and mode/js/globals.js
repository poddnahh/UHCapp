// ----------------------------------------------------------------------------
// js/globals.js
// Load your local reportList.json and pluck out the first entry
// (or the one matching ?report=Name).
// ----------------------------------------------------------------------------

const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReady;
export const configReady = new Promise(res => { _configReady = res; });

;(async function loadReportConfig() {
  try {
    // reportList.json is next to index.html
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`${resp.status}`);
    const list = await resp.json();

    // allow override via ?report=Name
    const params = new URLSearchParams(window.location.search);
    const name = params.get("report");
    const entry = name
      ? list.find(r => r.name === name)
      : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry");
    }

    reportConfig.embedUrl = entry.embedUrl;
    reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
  }
  catch (err) {
    console.error("Could not load reportList.json:", err);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reports:<br>${err.message}
      </div>`;
  }
  finally {
    _configReady();
  }
})();
