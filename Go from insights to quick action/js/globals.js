// globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Go from insights to quick action"
// - Dynamically loads embedUrl & reportId from reportList.json
// ----------------------------------------------------------------------------

// 1) reportConfig will hold the values for index.js to use when embedding
const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

// 2) Promise that signals when reportConfig is ready
let configReadyResolve;
const configReady = new Promise(res => { configReadyResolve = res; });

// 3) Existing state & DOM caches — DO NOT REMOVE or ALTER these:
const reportShowcaseState = {
  report: null,
  data: null,
  allChecked: false,
  tooltipNextPressed: false
};

const body               = $("#insight-to-action");
const embedContainer     = $("#report-container").get(0);
const overlay            = $("#overlay");
const distributionDialog = $("#distribution-dialog");
const dialogMask         = $("#dialog-mask");
const sendDialog         = $("#send-dialog");
const successDialog      = $("#success-dialog");
const closeBtn1          = $("#close1");
const closeBtn2          = $("#close2");
const sendCouponBtn      = $("#send-coupon");
const sendDiscountBtn    = $("#send-discount");
const sendMessageBtn     = $("#send-message");
const successCross       = $("#success-cross");

const HIDE_OVERFLOW      = "overflow-hidden";
let isDialogClosed       = true;
const KEYCODE_TAB        = 9;
const KEYCODE_ESCAPE     = 27;
const Keys               = Object.freeze({ TAB: "Tab", ESCAPE: "Escape" });
const TABLE_VISUAL_GUID  = "1149606f2a101953b4ba";
let tableVisual;

const base64Icon = "data:image/png;base64,..."; // your existing icon data

// 4) Load reportList.json and populate reportConfig
;(function loadReportList() {
  // Read ?report=Name if present
  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report") || null;

  fetch("./reportList.json")
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(list => {
      // Find matching entry or default to first
      let entry = reportName && list.find(r => r.name === reportName);
      if (!entry) entry = list[0];
      if (!entry || !entry.embedUrl) {
        throw new Error(`Report not found: ${reportName || list[0].name}`);
      }

      // Populate config
      reportConfig.embedUrl = entry.embedUrl;
      // Extract reportId query param
      const url = new URL(entry.embedUrl);
      reportConfig.reportId = url.searchParams.get("reportId");

      // Signal that config is now ready
      configReadyResolve();
    })
    .catch(err => {
      console.error("reportList.json error:", err);
      overlay.innerHTML = `
        <div style="color:red; padding:20px;">
          Failed to load report list:<br>${err.message}
        </div>`;
      // Still resolve so index.js can proceed (and show its own errors)
      configReadyResolve();
    });
})();
