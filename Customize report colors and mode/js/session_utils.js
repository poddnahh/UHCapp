// js/session_utils.js
// ----------------------------------------------------------------------------
// Playground-style embed token refresh.  You can leave this untouched.

// API Endpoint to get the JSON response of Embed URL, Embed Token and reportId
const reportEndpoint = "https://aka.ms/ThemeReportEmbedConfig";
const minutesToRefreshBeforeExpiration = 2;
let tokenExpiration;

function handleNewEmbedConfig(cfg, updateToken) {
  reportConfig.accessToken = cfg.EmbedToken.Token || cfg.EmbedToken?.token;
  reportConfig.embedUrl    = cfg.EmbedUrl || cfg.embedUrl;
  reportConfig.reportId    = cfg.Id || cfg.id;

  if (updateToken) {
    const container = document.querySelector(".report-container");
    const embedded = powerbi.get(container);
    embedded?.setAccessToken(reportConfig.accessToken);
  }

  tokenExpiration = (cfg.MinutesToExpiration||cfg.minutesToExpiration) * 60 * 1000;
  setTokenExpirationListener();
}

function populateEmbedConfigIntoCurrentSession(updateToken) {
  try {
    const p = window.parent.showcases.personalizeReportDesign;
    if (p) {
      const diffMs   = new Date(p.expiration) - new Date();
      const diffMin  = Math.round(((diffMs%86400000)%3600000)/60000);
      handleNewEmbedConfig({
        EmbedToken: { Token: p.token },
        EmbedUrl: p.embedUrl,
        Id: p.id,
        MinutesToExpiration: diffMin
      }, updateToken);
      return Promise.resolve();
    }
  } catch (_) {}

  return $.getJSON(reportEndpoint, cfg => handleNewEmbedConfig(cfg, updateToken));
}

function setTokenExpirationListener() {
  const safety = minutesToRefreshBeforeExpiration * 60 * 1000;
  const timeout = tokenExpiration - safety;
  if (timeout <= 0) {
    populateEmbedConfigIntoCurrentSession(true);
  } else {
    setTimeout(() => populateEmbedConfigIntoCurrentSession(true), timeout);
  }
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) setTokenExpirationListener();
});

export function loadThemesShowcaseReportIntoSession() {
  return populateEmbedConfigIntoCurrentSession(false);
}
