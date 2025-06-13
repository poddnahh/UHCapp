// js/index.js
// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// We assume globals.js has already defined:
//   reportConfig = { accessToken:null, embedUrl:null, reportId:null };
//   configReady  (we’ll ignore that and drive our own loading here)
//   embedContainer, overlay, distributionDialog, dialogMask, sendDialog, successDialog,
//   closeBtn1, closeBtn2, sendCouponBtn, sendDiscountBtn, sendMessageBtn, successCross,
//   bodyElement, contentElement, dropdownDiv, themesList, themeContainer, horizontalRule,
//   themeButton, themeBucket, allUIElements, etc.
// And functions: buildThemePalette(), embedThemesReport(), setReportAccessibilityProps(), etc.

$(document).ready(async function() {
  // 1) Load your reportList.json
  let list;
  try {
    const resp = await fetch('reportList.json');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    list = await resp.json();
  } catch (err) {
    console.error('Failed to load reportList.json:', err);
    overlay.innerHTML = `<div style="color:red;padding:20px;">
      Failed to load report list:<br>${err.message}
    </div>`;
    return;
  }

  // 2) Pick either ?report=Name or default to first
  const params     = new URLSearchParams(window.location.search);
  const want       = params.get('report');
  let entry        = want && list.find(r=>r.name===want);
  if (!entry) entry = list[0];
  if (!entry || !entry.embedUrl) {
    overlay.innerHTML = `<div style="color:red;padding:20px;">No valid report found.</div>`;
    return;
  }

  // 3) Populate your global reportConfig
  reportConfig.embedUrl  = entry.embedUrl;
  reportConfig.reportId  = new URL(entry.embedUrl).searchParams.get('reportId');

  // 4) Bootstrap PowerBI & hide all dialogs initially
  powerbi.bootstrap(embedContainer, { type: "report" });
  distributionDialog.hide();
  dialogMask.hide();
  sendDialog.hide();
  successDialog.hide();

  // 5) Embed and build UI
  embedThemesReport();
  buildThemePalette();

  // 6) Cache dynamic controls for keyboard handling
  themeSlider           = $("#theme-slider");
  dataColorNameElements = $(".data-color-name");
  themeSwitchLabel      = $(".theme-switch-label");
  horizontalSeparator   = $(".dropdown-separator");
  sliderCheckbox        = $(".slider");

  allUIElements = [
    bodyElement, contentElement, dropdownDiv,
    themeContainer, themeSwitchLabel, horizontalSeparator,
    horizontalRule, sliderCheckbox, themeButton,
    themeBucket, dataColorNameElements
  ];

  // 7) Restore focus when dropdown opens/closes
  dropdownDiv.on("hidden.bs.dropdown", ()=> themeButton.focus());
  dropdownDiv.on("shown.bs.dropdown", ()=> themeSlider.focus());
});

// Prevent the dropdown from accidentally closing when interacting
$(document).on("click", ".allow-focus", e => e.stopPropagation());

// Handle Shift+Tab inside the slider to close the menu
$(document).on("keydown", "#theme-slider", function(e) {
  if (e.shiftKey && (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB)) {
    dropdownDiv.removeClass("show");
    themesList.removeClass("show");
    themeButton.attr("aria-expanded","false");
  }
});

// Your existing embedThemesReport(), applyTheme(), toggleTheme(), etc.
// remain completely untouched and will now pick up reportConfig.embedUrl/reportId
