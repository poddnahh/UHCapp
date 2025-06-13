// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

(async function () {
  // 1) Wait until globals.js has loaded reportConfig
  await configReady;

  // 2) Grab your DOM elements
  const container = document.querySelector(".report-container");
  const overlay   = document.getElementById("overlay");

  // 3) Bootstrap Power BI
  powerbi.bootstrap(container, { type: "report" });

  // 4) Ensure we actually have an embedUrl & reportId
  const { embedUrl, reportId } = reportConfig;
  if (!embedUrl || !reportId) {
    overlay.innerHTML = `
      <div style="color:red;padding:20px;">
        No report found to embed.<br>
        Check your reportList.json path.
      </div>`;
    return;
  }

  // 5) Build the minimal embed configuration
  const models = window["powerbi-client"].models;
  const config = {
    type:       "report",
    tokenType:  models.TokenType.Embed,
    accessToken:"",            // public embeds do not need one
    embedUrl,
    id: reportId,
    settings: {
      panes: {
        filters:        { visible: false },
        pageNavigation: { visible: false }
      },
      layoutType:   models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    }
  };

  // 6) Perform the embed
  const report = powerbi.embed(container, config);

  // 7) Hide the spinner & show your page on load
  report.on("loaded", () => {
    overlay.style.display = "none";
    document.querySelector(".content").style.display = "block";
  });

  report.on("error", err => {
    overlay.innerHTML = `
      <div style="color:red;padding:20px;">
        Embed error:<br>${err.message}
      </div>`;
    console.error(err);
  });
})();
