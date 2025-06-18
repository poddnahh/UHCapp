function generateShareLink(id) {
  return `share_bookmark.html?id=${encodeURIComponent(id)}`;
}

async function captureBookmark(report) {
  const capture = await report.bookmarksManager.capture({ personalizeVisuals: true });
  const exportResult = await report.exportToFile({ format: 'png' });
  return { state: capture.state, screenshot: exportResult.data };
}

if (typeof window !== 'undefined') {
  window.bookmarkUtils = { generateShareLink, captureBookmark };
}

if (typeof module !== 'undefined') {
  module.exports = { generateShareLink, captureBookmark };
}
