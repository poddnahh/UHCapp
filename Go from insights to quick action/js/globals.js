// ----------------------------------------------------------------------------
// Custom Globals for Dynamic Embed from reportList.json
// ----------------------------------------------------------------------------

// Report configuration (will be filled in below)
const reportConfig = {
  accessToken: null,
  embedUrl:    null,
  reportId:    null
};

// Existing state and DOM caches (unchanged)
const reportShowcaseState = { report: null, data: null, allChecked: false, tooltipNextPressed: false };
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
let isDialogClosed      = true;
const KEYCODE_TAB        = 9;
const KEYCODE_ESCAPE     = 27;
const Keys               = Object.freeze({ TAB: "Tab", ESCAPE: "Escape" });
const TABLE_VISUAL_GUID  = "1149606f2a101953b4ba";
let tableVisual;
const base64Icon = "data:image/png;base64,…"; // your existing icon data

// ----------------------------------------------------------------------------
// Step 1: Load reportList.json (next to index.html) and set reportConfig
// ----------------------------------------------------------------------------
const params     = new URLSearchParams(window.location.search);
const reportName = params.get("report") || null;

fetch("./reportList.json")
  .then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  })
  .then(list => {
    // find the requested report or default to first
    let item = reportName && list.find(r => r.name === reportName);
    if (!item) item = list[0];
    if (!item || !item.embedUrl) {
      throw new Error(`Report "${reportName || list[0].name}" not found`);
    }
    // populate config
    reportConfig.embedUrl = item.embedUrl;
    reportConfig.reportId = new URL(item.embedUrl).searchParams.get("reportId");
    // now your existing embedReport() in index.js will run with this config
  })
  .catch(err => {
    console.error("reportList.json error:", err);
    overlay.innerHTML = `<div style="color:red; padding:20px;">Failed to load report list:<br>${err.message}</div>`;
  });
