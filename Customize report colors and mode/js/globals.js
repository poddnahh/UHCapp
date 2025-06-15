// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json (must live next to index.html)
// and pick the first entry (or one matching ?report=Name).

// This is the global that our other scripts will read:
window.reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null,
};

// Promise to signal when reportConfig is ready:
let _resolveConfig;
window.configReady = new Promise(r => { _resolveConfig = r; });

;(async function loadReportConfig() {
  try {
    console.log("globals.js: fetching reportList.json…");
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    // override via ?report=Foo
    const params = new URLSearchParams(window.location.search);
    const name   = params.get("report");
    const entry  = name ? list.find(r => r.name === name) : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry in reportList.json");
    }

    // fill our global
    window.reportConfig.embedUrl  = entry.embedUrl;
    window.reportConfig.reportId = new URL(entry.embedUrl)
      .searchParams.get("reportId");

    console.log("globals.js: loaded", window.reportConfig);
  }
  catch (e) {
    console.error("globals.js: could not load reportList.json:", e);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
  }
  finally {
    _resolveConfig();
  }
})();
