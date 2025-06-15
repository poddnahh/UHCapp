// js/session_utils.js
// ----------------------------------------------------------------------------

const reportEndpoint = "https://aka.ms/ThemeReportEmbedConfig";
let tokenExpiration;

// Internal: call the endpoint and wire up reportConfig.accessToken
async function fetchEmbedConfig(updateToken) {
  try {
    const embedConfig = await $.getJSON(reportEndpoint);
    // apply to window.reportConfig
    window.reportConfig.accessToken = embedConfig.EmbedToken.Token;
    tokenExpiration = embedConfig.MinutesToExpiration * 60 * 1000;
    scheduleTokenRefresh();
    if (updateToken) {
      const report = powerbi.get($(".report-container").get(0));
      report.setAccessToken(embedConfig.EmbedToken.Token);
    }
  } catch (e) {
    console.error("session_utils:", e);
  }
}

function scheduleTokenRefresh() {
  const safety = 2 * 60 * 1000;
  const timeout = tokenExpiration - safety;
  if (timeout <= 0) return fetchEmbedConfig(true);
  setTimeout(() => fetchEmbedConfig(true), timeout);
}

// **Restore this function** so index.js can await it:
function loadThemesShowcaseReportIntoSession() {
  // first-time fetch
  return fetchEmbedConfig(false);
}

// Kick off only after globals.js has populated reportUrl/reportId
window.configReady.then(() => loadThemesShowcaseReportIntoSession());

// Refresh token on tab visible
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) scheduleTokenRefresh();
});
