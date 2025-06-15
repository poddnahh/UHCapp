// ----------------------------------------------------------------------------
// js/globals.js
// ----------------------------------------------------------------------------

// This holds the embed values we’ll use in index.js
const reportConfig = { accessToken: null, embedUrl: null, reportId: null };

let _configReady;
export const configReady = new Promise(res => { _configReady = res; });

;(async function loadReportConfig() {
  try {
    // reportList.json must be alongside index.html
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
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

    reportConfig.embedUrl  = entry.embedUrl;
    reportConfig.reportId  = new URL(entry.embedUrl)
                              .searchParams
                              .get("reportId");
  }
  catch (e) {
    console.error("Could not load reportList.json:", e);
    // show the message in the spinner overlay
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reports:<br>${e.message}
      </div>`;
  }
  finally {
    // let session_utils and index.js proceed
    _configReady();
  }
})();
