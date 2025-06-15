// js/index.js
// --------------------------------------------------------------------
// Simplified embed: hard-code the token you generated via PowerShell,
// then immediately embed the report from reportList.json.

// 1) Load the list
async function loadReportConfig() {
  const resp = await fetch("./reportList.json");
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const list = await resp.json();
  const name = new URLSearchParams(location.search).get("report");
  const entry = name
    ? list.find(r => r.name === name)
    : list[0];
  if (!entry) throw new Error("No matching report in reportList.json");
  return entry;
}

// 2) Bootstrap & embed
(async function() {
  try {
    const entry = await loadReportConfig();

    // your long-lived embed token
    const accessToken = "<YOUR_TOKEN>";

    // pull the reportId out of the URL (or you could hard-code that too)
    const reportId = new URL(entry.embedUrl)
                        .searchParams.get("reportId");

    // prepare the container
    const container = document.querySelector(".report-container");
    powerbi.bootstrap(container, { type: "report" });

    // build the embed config
    const models = window["powerbi-client"].models;
    const config = {
      type:       "report",
      tokenType:  models.TokenType.Embed,
      accessToken,
      embedUrl:   entry.embedUrl,
      id:         reportId,
      settings: {
        panes: {
          filters:        { visible: false },
          pageNavigation: { visible: false }
        },
        layoutType:   models.LayoutType.Custom,
        customLayout: { displayOption: models.DisplayOption.FitToPage },
        background:   models.BackgroundType.Transparent
      },
      // use your existing theme arrays
      theme: { themeJson: Object.assign({}, jsonDataColors[0], themes[0]) }
    };

    // actually embed
    const report = powerbi.embed(container, config);

    // when loaded, hide spinner and wire up the radio buttons
    report.on("loaded", () => {
      document.getElementById("overlay").style.display = "none";
      document.querySelector(".content").style.display = "block";
      document.querySelector("#theme-dropdown #datacolor0").checked = true;
    });

    // wire your dropdown UI (you already have buildThemePalette)
    buildThemePalette();

  } catch (err) {
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Error embedding report:<br>${err.message}
      </div>
    `;
    console.error(err);
  }
})();
