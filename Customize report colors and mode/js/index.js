// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(document).ready(async function() {
  // 1) Load the report list JSON (must live alongside index.html & this script)
  let list;
  try {
    const resp = await fetch('./reportList.json');
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
  const url = new URL(entry.embedUrl);
  const reportId = url.searchParams.get('reportId');

  // 4) Bootstrap the Power BI container
  powerbi.bootstrap(embedContainer, { type: 'report' });

  // 5) Hide any dialogs you have
  distributionDialog.hide();
  dialogMask.hide();
  sendDialog.hide();
  successDialog.hide();

  // 6) Build the theme picker UI
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
    // apply your initial theme/colors
    theme: { themeJson: Object.assign({}, jsonDataColors[0], themes[0]) }
  };

  const report = powerbi.embed(embedContainer, config);

  // 8) When loaded, hide spinner & show content
  report.on('loaded', () => {
    $('#overlay').hide();
    $('.content').show();
    $('#theme-dropdown #datacolor0').prop('checked', true);
    console.log('✅ Report loaded:', entry.name);
  });

  // 9) On errors, show message
  report.on('error', event => {
    console.error('Embed error:', event.detail || event);
    $('#overlay').html(
      `<div style="color:red;padding:20px;">
         Power BI embed failed<br>${event.detail?.message||event}
       </div>`
    );
  });

  // 10) Wire up your dropdown focus handlers
  $('#theme-slider').on('keydown', e => {
    if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
      dropdownDiv.removeClass('show');
      themesList.removeClass('show');
      themeButton.attr('aria-expanded','false');
    }
  });
  dropdownDiv.on('hidden.bs.dropdown', ()=> themeButton.focus());
  dropdownDiv.on('shown.bs.dropdown', ()=> $('#theme-slider').focus());
  $(document).on('click', '.allow-focus', e => e.stopPropagation());
});

// **All** of your existing helper functions—
// buildThemePalette, buildThemeSwitcher, buildSeparator,
// buildDataColorElement, applyTheme, toggleTheme,
// toggleDarkThemeOnElements—remain exactly as they were.
