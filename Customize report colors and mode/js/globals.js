// js/globals.js
// ----------------------------------------------------------------------------
// 1) Hold the embed values we’ll use in index.js
window.reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

// 2) Expose a promise that resolves once reportConfig is set
let _resolveConfig;
window.configReady = new Promise(r => _resolveConfig = r);

// 3) Immediately fetch reportList.json
;(async function loadReportConfig() {
  try {
    console.log("globals.js → fetching reportList.json");
    const resp = await fetch("./reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    // allow ?report=Name override
    const name  = new URLSearchParams(location.search).get("report");
    const entry = name
      ? list.find(r => r.name === name)
      : list[0];

    if (!entry || !entry.embedUrl || !entry.reportId) {
      throw new Error("No valid report entry in reportList.json");
    }

    window.reportConfig.embedUrl  = entry.embedUrl;
    window.reportConfig.reportId  = entry.reportId;

    console.log("globals.js → reportConfig:", window.reportConfig);
  }
  catch (e) {
    console.error("globals.js:", e);
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
  }
  finally {
    _resolveConfig();
  }
})();
