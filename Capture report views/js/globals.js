let reportConfig = {
  accessToken: null,
  embedUrl: null,
  reportId: null,
  type: "report"
};

let bookmarkShowcaseState = {
  bookmarks: [],
  report: null,
  bookmarkCounter: 1
};

const overlay = $("#overlay");
const reportContainer = $("#report-container").get(0);
const bookmarkContainer = $("#bookmark-container").get(0);

const listViewsBtn = $("#display-btn");
const bookmarksList = $("#bookmarks-list");
const bookmarksDropdown = $(".bookmarks-dropdown");
const viewName = $("#viewname");
const saveViewBtn = $("#save-view-btn");
const copyLinkBtn = $("#copy-link-btn");
const captureModal = $("#modal-action");
const closeModal = $(".close");
const saveViewDiv = $("#save-view-div");
const captureViewDiv = $("#capture-view-div");
const copyBtn = $("#copy-btn");
const tickIcon = $("#tick-icon");
const tickBtn = $("#tick-btn");
const copyLinkText = $("#copy-link-text");
const copyLinkSuccessMsg = $("#copy-link-success-msg");
const closeBtn = $("#close-btn");

const CHECKBOX = "input[type=checkbox]";
const ACTIVE_BOOKMARK = "active-bookmark";
const INACTIVE_BOOKMARK = "inactive-bookmark";
const FOCUSED = "focused";
const VISIBLE = "visible";
const INVISIBLE = "invisible";
const COPY_BOOKMARK = "copy-bookmark";
const SELECTED_BUTTON = "selected-button";
const ACTIVE_BUTTON = "btn-active";
const INVALID_FIELD = "is-invalid";
const DISPLAY = "show";

const SAVE_VIEW_BUTTON_ID = "save-view-btn";
const COPY_LINK_BUTTON_ID = "copy-link-btn";

const captureModalElements = {
  firstElement: closeModal,
  lastElement: {
    saveView: $("#save-bookmark-btn"),
    copyLink: $("#copy-btn")
  }
};

