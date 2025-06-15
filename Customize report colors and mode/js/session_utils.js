// js/session_utils.js
// ----------------------------------------------------------------------------
// This file runs *after* globals.js and waits for configReady
// to populate reportConfig before requesting tokens/etc.

const reportEndpoint = "https://aka.ms/ThemeReportEmbedConfig";
let tokenExpiration;

// Populate token/embedUrl/reportId into reportConfig
function handleNewEmbedConfig(embedConfig, updateToken) {
  // set from REST or parent window
  reportConfig.accessToken = embedConfig.EmbedToken.Token;
  // embedUrl/reportId were set by globals.js already

  tokenExpiration = embedConfig.MinutesToExpiration * 60 * 1000;
  scheduleTokenRefresh();
  if (updateToken) {
    const container = document.querySelector(".report-container");
    const report    = powerbi.get(container);
    report.setAccessToken(embedConfig.EmbedToken.Token);
  }
}

async function fetchEmbedConfig(updateToken) {
  try {
    const payload = await $.getJSON(reportEndpoint);
    handleNewEmbedConfig(payload, updateToken);
  } catch (e) {
    console.error("session_utils:", e);
  }
}

// initial call
window.configReady.then(() => fetchEmbedConfig(false));

function scheduleTokenRefresh() {
  const safety = 2 * 60 * 1000; // 2 minutes
  const timeout = tokenExpiration - safety;
  if (timeout <= 0) return fetchEmbedConfig(true);
  setTimeout(() => fetchEmbedConfig(true), timeout);
}

// refresh on visibility
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) scheduleTokenRefresh();
});
