// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(document).ready(async function() {
  // 1) Load the report list JSON from the Go from insights to quick action folder
  let list;
  try {
    const resp = await fetch('../Go%20from%20insights%20to%20quick%20action/reportList.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    list = await resp.json();
  } catch (err) {
    console.error('Failed to load reportList.json:', err);
    $('#overlay').html(
      `<div style="color:red;padding:20px;">
         Failed to load report list:<br>${err.message}
       </div>`
    );
    return;
  }

  // 2) Pick ?report=Name or default to first entry
  const params = new URLSearchParams(window.location.search);
  const want   = params.get('report');
  let entry    = want && list.find(r=>r.name===want);
  if (!entry) entry = list[0];
  if (!entry || !entry.embedUrl) {
    $('#overlay').html(
      `<div style="color:red;padding:20px;">No valid report found</div>`
    );
    return;
  }

  // 3) Extract reportId from the embedUrl
  const url      = new URL(entry.embedUrl);
  const reportId = url.searchParams.get('reportId');

  // 4) Bootstrap the Power BI container
  powerbi.bootstrap(embedContainer, { type: 'report' });

  // 5) Hide your dialogs initially
  distributionDialog.hide();
  dialogMask.hide();
  sendDialog.hide();
  successDialog.hide();

  // 6) Build the theme-picker UI
  buildThemePalette();

  // 7) Perform the embed
  const models = window['powerbi-client'].models;
  const config = {
    type:       'report',
    tokenType:  models.TokenType.Embed,
    accessToken:'',                  // public embed
    embedUrl:   entry.embedUrl,
    id:         reportId,
    permissions: models.Permissions.View,
    settings: {
      panes: {
        filters:        { visible: false, expanded: false },
        pageNavigation: { visible: false }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToPage },
      background:   models.BackgroundType.Transparent
    },
    // initial theme/colors
    theme: { themeJson: Object.assign({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(embedContainer, config);

  // 8) On load, hide spinner & show content
  report.on('loaded', () => {
    $('#overlay').hide();
    $('.content').show();
    $('#theme-dropdown #datacolor0').prop('checked', true);
    console.log('✅ Report loaded:', entry.name);
  });

  // 9) On error, show message
  report.on('error', event => {
    console.error('Embed error:', event.detail || event);
    $('#overlay').html(
      `<div style="color:red;padding:20px;">
         Power BI embed failed<br>${event.detail?.message||event}
       </div>`
    );
  });

  // 10) Dropdown focus handlers
  dropdownDiv.on('hidden.bs.dropdown', () => themeButton.focus());
  dropdownDiv.on('shown.bs.dropdown', () => $('#theme-slider').focus());
  $(document).on('keydown', '#theme-slider', e => {
    if (e.shiftKey && (e.key===Keys.TAB || e.keyCode===KEYCODE_TAB)) {
      dropdownDiv.removeClass('show');
      themesList.removeClass('show');
      themeButton.attr('aria-expanded','false');
    }
  });
  $(document).on('click', '.allow-focus', e => e.stopPropagation());
});
