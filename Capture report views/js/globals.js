// ----------------------------------------------------------------------------
// Customized globals.js for public Power BI embed with Capture Report Views
// ----------------------------------------------------------------------------

// Global config for current embedded report
let reportConfig = {
    accessToken: null,          // No token needed for public "view" reports
    embedUrl: undefined,
    reportId: undefined,
    type: "report"
};

// Bookmark showcase state management
let bookmarkShowcaseState = {
    bookmarks: null,
    report: null,
    bookmarkCounter: 1          // Counter for user-created bookmarks
};

// Cached DOM references
const listViewsBtn        = $("#display-btn");
const copyLinkSuccessMsg  = $("#copy-link-success-msg");
const viewName            = $("#viewname");
const tickBtn             = $("#tick-btn");
const tickIcon            = $("#tick-icon");
const bookmarksList       = $("#bookmarks-list");
const copyBtn             = $("#copy-btn");
const copyLinkText        = $("#copy-link-text");
const copyLinkBtn         = $("#copy-link-btn");
const saveViewBtn         = $("#save-view-btn");
const captureViewDiv      = $("#capture-view-div");
const saveViewDiv         = $("#save-view-div");
const overlay             = $("#overlay");
const bookmarksDropdown   = $(".bookmarks-dropdown");
const captureModal        = $("#modal-action");
const closeModal          = $("#close-modal-btn");
const viewLinkBtn         = $("#copy-btn");
const saveBtn             = $("#save-bookmark-btn");
const closeBtn            = $("#close-btn");

// Report containers
const reportContainer     = $("#report-container").get(0);
const bookmarkContainer   = $("#bookmark-container").get(0); // May be unused

// Keyboard support
const KEYCODE_TAB = 9;
const Keys = { TAB: "Tab" };
Object.freeze(Keys); // Freeze Keys enum

// CSS class constants
const SELECTED_BUTTON     = "selected-button";
const COPY_BOOKMARK       = "copy-bookmark";
const ACTIVE_BUTTON       = "btn-active";
const VISIBLE             = "visible";
const INVISIBLE           = "invisible";
const INACTIVE_BOOKMARK   = "inactive-bookmark";
const ACTIVE_BOOKMARK     = "active-bookmark";
const INVALID_FIELD       = "is-invalid";
const FOCUSED             = "focused";
const DISPLAY             = "show";
const CHECKBOX            = "input[type=checkbox]";

// Button IDs
const SAVE_VIEW_BUTTON_ID = "save-view-btn";
const COPY_LINK_BUTTON_ID = "copy-link-btn";

// Track focus for modal accessibility
let checkBoxState = null;
let lastActiveElement;

const captureModalElements = {
    firstElement: closeModal,
    lastElement: {
        saveView: saveBtn,
        copyLink: viewLinkBtn
    }
};

// Optional: Extract bookmark ID from URL for deep-link support (e.g. ?id=bookmark_1)
const regex = new RegExp("[?&]id(=([^&#]*)|&|#|$)");
