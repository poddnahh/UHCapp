// Minimal session utils for capture report views

const HARDCODED_EMBED_TOKEN = '<EMBED_TOKEN_PLACEHOLDER>';

function loadSampleReportIntoSession() {
  return Promise.resolve();
}

function setConfig(accessToken, embedUrl, reportId) {
  reportConfig.accessToken = accessToken || HARDCODED_EMBED_TOKEN;
  reportConfig.embedUrl = embedUrl;
  reportConfig.reportId = reportId;
}
