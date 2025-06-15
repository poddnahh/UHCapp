// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json (must sit next to index.html),
// pick the first entry (or override via ?report=Name).

// 1) Define our global config object and ready-promise:
window.reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};
let _resolveConfig;
window.configReady = new Promise(r => _resolveConfig = r);

// 2) Immediately fetch and populate:
;(async function loadReportConfig() {
  try {
    console.log("globals.js → fetching reportList.json");
    const resp = await fetch("./reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    const params = new URLSearchParams(location.search);
    const name   = params.get("report");
    const entry  = name
      ? list.find(r => r.name === name)
      : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry in reportList.json");
    }

    window.reportConfig.embedUrl  = entry.embedUrl;
    window.reportConfig.reportId = new URL(entry.embedUrl)
      .searchParams.get("reportId");

    console.log("globals.js → loaded reportConfig", window.reportConfig);
  }
  catch (e) {
    console.error("globals.js:", e);
    document
      .getElementById("overlay")
      .innerHTML = `<div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
  }
  finally {
    _resolveConfig();
  }
})();
