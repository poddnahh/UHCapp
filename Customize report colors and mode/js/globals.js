// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json and pluck out the first entry
// (or one matching ?report=Name).

// This global gets filled in by the fetch below:
const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

// Promise to let index.js know when we're done:
let _resolveConfig;
const configReady = new Promise(r => { _resolveConfig = r; });

(async function loadReportConfig() {
  try {
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    // override via ?report=Foo if desired
    const params = new URLSearchParams(window.location.search);
    const name   = params.get("report");
    const entry  = name ? list.find(r => r.name === name) : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry in reportList.json");
    }

    reportConfig.embedUrl  = entry.embedUrl;
    // extract the reportId query-param from the embedUrl
    reportConfig.reportId = new URL(entry.embedUrl).searchParams.get("reportId");
  }
  catch (e) {
    console.error("Could not load reportList.json:", e);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
  }
  finally {
    _resolveConfig();
  }
})();
