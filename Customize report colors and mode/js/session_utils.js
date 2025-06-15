// js/session_utils.js
// ----------------------------------------------------------------------------
// Playground normally calls a remote endpoint for tokens.
// Here we just wait for globals.js to finish, then we
// know reportConfig.embedUrl & reportConfig.reportId are populated.
// If you need to fetch/refresh a token, do it here and then
// write it into `reportConfig.accessToken`.

async function loadThemesShowcaseReportIntoSession() {
  await configReady;

  if (!reportConfig.embedUrl || !reportConfig.reportId) {
    return Promise.reject(new Error("reportConfig not defined"));
  }

  // If you have a hard-coded token or another local fetch for a token,
  // do it here (and set reportConfig.accessToken).
  // e.g. reportConfig.accessToken = "...";

  return;
}
