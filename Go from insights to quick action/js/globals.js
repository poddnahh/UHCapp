// globals.js
// ----------------------------------------------------------------------------
// Custom Globals for "Go from insights to quick action"
// Dynamically loads embedUrl & reportId from reportList.json
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

// ----------------------------------------------------------------------------
// Step: Compute the current folder path and fetch reportList.json
// ----------------------------------------------------------------------------
;(function loadReportList() {
  // Determine base path (folder containing this index.html)
  let path = window.location.pathname;             // e.g. "/UHCapp/Go%20from%20insights%20to%20quick%20action/"
  if (path.endsWith("index.html")) {
    path = path.substring(0, path.lastIndexOf("index.html"));
  }
  if (!path.endsWith("/")) {
    path += "/";
  }
  const jsonUrl = path + "reportList.json";

  // Read ?report=Name if present
  const params     = new URLSearchParams(window.location.search);
  const reportName = params.get("report") || null;

  fetch(jsonUrl)
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
      // Extract reportId query param from embedUrl
      const url = new URL(entry.embedUrl);
      reportConfig.reportId = url.searchParams.get("reportId");

      // Signal that config is now ready
      configReadyResolve();
    })
    .catch(err => {
      console.error("reportList.json error:", err);
      overlay.innerHTML = `
        <div style="color:red; padding:20px; font-size:16px;">
          Failed to load report list:<br>${err.message}
        </div>`;
      // Resolve anyway so index.js can proceed
      configReadyResolve();
    });
})();
