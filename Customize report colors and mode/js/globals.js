// js/globals.js
// ----------------------------------------------------------------------------
// Load your local reportList.json and pluck out the first entry
// (or one matching ?report=Name).

// the values we'll fill in for index.js to consume
const reportConfig = {
  accessToken: null,
  embedUrl:   null,
  reportId:   null
};

// promise that signals when reportConfig is ready
let _configReady;
const configReady = new Promise(resolve => {
  _configReady = resolve;
});

;(async function loadReportConfig() {
  try {
    // reportList.json must be alongside index.html
    const resp = await fetch("reportList.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const list = await resp.json();

    // allow override via ?report=Name
    const params = new URLSearchParams(window.location.search);
    const name   = params.get("report");
    const entry  = name
      ? list.find(x => x.name === name)
      : list[0];

    if (!entry || !entry.embedUrl) {
      throw new Error("No valid report entry in reportList.json");
    }

    // populate our global object
    reportConfig.embedUrl  = entry.embedUrl;
    reportConfig.reportId = new URL(entry.embedUrl)
                              .searchParams
                              .get("reportId");
  }
  catch (e) {
    console.error("Could not load reportList.json:", e);
    document
      .getElementById("overlay")
      .innerHTML = `
        <div style="color:red;padding:20px;">
          Failed to load reportList.json:<br>${e.message}
        </div>`;
  }
  finally {
    // allow index.js to proceed
    _configReady();
  }
})();
