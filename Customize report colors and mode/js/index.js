// index.js
// ----------------------------------------------------------------------------
// Embeds the report & builds the theme‐picker UI
// ----------------------------------------------------------------------------

let themeSlider, dataColorNameElements, themeSwitchLabel,
    horizontalSeparator, sliderCheckbox, allUIElements;

// cache your DOM
const bodyElement    = $('body');
const overlay        = $('#overlay');
const dropdownDiv    = $('.dropdown');
const themesList     = $('#theme-dropdown');
const contentElement = $('.content');
const themeContainer = $('.theme-container');
const horizontalRule = $('.horizontal-rule');
const themeButton    = $('.btn-theme');
const themeBucket    = $('.bucket-theme');
const embedContainer = $('.report-container').get(0);

// key constants
const KEYCODE_TAB = 9;
const Keys = Object.freeze({ TAB:'Tab' });

(async function startup() {
  // wait for your globals.js to finish
  await configReady;

  // bootstrap PowerBI
  powerbi.bootstrap(embedContainer, { type: 'report' });

  // kick off embed + build UI
  await embedThemesReport();
  buildThemePalette();

  // cache UI controls for focus/toggle
  themeSlider           = $('#theme-slider');
  dataColorNameElements = $('.data-color-name');
  themeSwitchLabel      = $('.theme-switch-label');
  horizontalSeparator   = $('.dropdown-separator');
  sliderCheckbox        = $('.slider');
  allUIElements = [
    bodyElement, contentElement, dropdownDiv,
    themeContainer, themeSwitchLabel, horizontalSeparator,
    horizontalRule, sliderCheckbox, themeButton,
    themeBucket, dataColorNameElements
  ];

  // restore focus when dropdown opens/closes
  dropdownDiv
    .on('hidden.bs.dropdown', ()=> themeButton.focus())
    .on('shown.bs.dropdown', ()=> themeSlider.focus());
})();

// prevent BS4 dropdown auto‐closing inside custom controls
$(document).on('click', '.allow-focus', e => e.stopPropagation());

// trap Shift+Tab inside theme slider
$(document).on('keydown', '#theme-slider', e => {
  if (e.shiftKey && (e.key===Keys.TAB||e.keyCode===KEYCODE_TAB)) {
    dropdownDiv.removeClass('show');
    themesList.removeClass('show');
    themeButton.attr('aria-expanded','false');
  }
});

async function embedThemesReport() {
  // load your token/url/reportId
  await loadThemesShowcaseReportIntoSession();

  const models        = window['powerbi-client'].models;
  const accessToken   = reportConfig.accessToken;
  const embedUrl      = reportConfig.embedUrl;
  const embedReportId = reportConfig.reportId;
  const permissions   = models.Permissions.View;

  // default theme + first data‐color
  let newTheme = {};
  $.extend(newTheme, jsonDataColors[0], themes[0]);

  const config = {
    type:       'report',
    tokenType:  models.TokenType.Embed,
    accessToken,
    embedUrl,
    id:         embedReportId,
    permissions,
    settings: {
      panes:           { filters: { visible:false }, pageNavigation:{ visible:false } },
      layoutType:      models.LayoutType.Custom,
      customLayout:    { displayOption: models.DisplayOption.FitToPage },
      background:      models.BackgroundType.Transparent
    },
    theme: { themeJson: newTheme }
  };

  const report = powerbi.embed(embedContainer, config);

  report.off('loaded');
  report.on('loaded', () => {
    overlay.hide();
    contentElement.show();
    themesList.find('#datacolor0').prop('checked', true);
  });

  report.off('rendered');
  report.on('rendered', () => {
    console.log('Customize Colors report rendered');
  });

  // optionally set a11y props
  report.setComponentTitle('Customize report colors & mode');
  report.setComponentTabIndex(0);
}
