// js/index.js
// ----------------------------------------------------------------------------
// Simplified embed: hard-code a token, pull URL from reportList.json, then embed.

(async function() {
  // 1) Load your list of publish-to-web URLs
  let list;
  try {
    const resp = await fetch("./reportList.json");
    if (!resp.ok) throw new Error(`reportList.json HTTP ${resp.status}`);
    list = await resp.json();
  } catch (e) {
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        Failed to load reportList.json:<br>${e.message}
      </div>`;
    return;
  }

  // 2) Pick the desired entry (?report=Name or first in array)
  const name = new URLSearchParams(window.location.search).get("report");
  const entry = name
    ? list.find(r => r.name === name)
    : list[0];
  if (!entry || !entry.embedUrl) {
    document.getElementById("overlay").innerHTML = `
      <div style="color:red;padding:20px;">
        No valid report entry found.
      </div>`;
    return;
  }

  // 3) Your long-lived embed token (paste the one you just fetched)
  const accessToken = "<YOUR_TOKEN_HERE>";

  // 4) Extract reportId (optional—you could hard-code this too)
  const reportId = new URL(entry.embedUrl).searchParams.get("reportId");

  // 5) Bootstrap the Power BI container
  const container = document.querySelector(".report-container");
  powerbi.bootstrap(container, { type: "report" });

  // 6) Build the embed configuration
  const models = window["powerbi-client"].models;
  const config = {
    type:        "report",
    tokenType:   models.TokenType.Embed,
    accessToken,
    embedUrl:    entry.embedUrl,
    id:          reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    theme: {
      // default to first palette/theme combo
      themeJson: Object.assign({}, jsonDataColors[0], themes[0])
    }
  };

  // 7) Embed and wire up loaded/rendered events
  const report = powerbi.embed(container, config);
  report.on("loaded", () => {
    document.getElementById("overlay").style.display = "none";
    document.querySelector(".content").style.display = "block";
    // check the first radio so the UI matches
    document.querySelector("#theme-dropdown #datacolor0").checked = true;
  });
  report.on("rendered", () => {
    console.log("Report rendered.");
  });

  // 8) Build your “Choose theme” dropdown (you already have this in themes.js)
  buildThemePalette();
})();
