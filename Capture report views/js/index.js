document.addEventListener('DOMContentLoaded', async () => {
  const reports = await fetch('./reportList.json').then(r => r.json());
  if (!reports || !reports.length) {
    console.error('No reports found in reportList.json');
    return;
  }

  const cfg = reports[0];
  setConfig(cfg.accessToken, cfg.embedUrl, cfg.reportId);

  await loadSampleReportIntoSession();

  const models = window['powerbi-client'].models;
  const embedConfig = {
    type: 'report',
    tokenType: models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl: reportConfig.embedUrl,
    id: reportConfig.reportId,
    permissions: models.Permissions.View,
    settings: { panes: { filters: { visible: false }, pageNavigation: { visible: false } } }
  };

  const container = document.getElementById('report-container');
  bookmarkShowcaseState.report = powerbi.embed(container, embedConfig);

  const overlay = document.getElementById('overlay');
  bookmarkShowcaseState.report.on('loaded', () => {
    if (overlay) overlay.style.display = 'none';
    bookmarkShowcaseState.report.off('loaded');
  });
});

async function saveView() {
  const name = document.getElementById('viewNameInput').value.trim();
  if (!name) return alert('Please enter a name.');

  const { screenshot, state } = await bookmarkUtils.captureBookmark(bookmarkShowcaseState.report);
  const saved = JSON.parse(localStorage.getItem('savedViews') || '[]');
  const id = `bookmark_${Date.now()}`;
  saved.push({ id, name, screenshot, state });
  localStorage.setItem('savedViews', JSON.stringify(saved));
  closeCaptureModal();
}

function openCaptureModal() {
  document.getElementById('viewNameInput').value = '';
  document.getElementById('captureModal').style.display = 'flex';
}

function closeCaptureModal() {
  document.getElementById('captureModal').style.display = 'none';
}

function openSavedViewsModal() {
  const list = document.getElementById('savedViewsList');
  const saved = JSON.parse(localStorage.getItem('savedViews') || '[]');
  list.innerHTML = '';
  saved.forEach(view => {
    const li = document.createElement('li');
    const link = bookmarkUtils.generateShareLink(view.id);
    li.innerHTML = `<strong>${view.name}</strong><br><img src="${view.screenshot}"/><br><a href="${link}">${link}</a>`;
    list.appendChild(li);
  });
  document.getElementById('savedViewsModal').style.display = 'flex';
}

function closeSavedViewsModal() {
  document.getElementById('savedViewsModal').style.display = 'none';
}

function copyShareLink() {
  const name = document.getElementById('viewNameInput').value.trim();
  if (!name) return alert('Please enter a name to generate the link.');
  const tempId = `bookmark_${Date.now()}`;
  const url = bookmarkUtils.generateShareLink(tempId);
  navigator.clipboard.writeText(url);
  alert('Link copied to clipboard');
}
