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
const bookmarksList = $("#bookmarks-list");
const copyBtn = $("#copy-btn");
const copyLinkText = $("#copy-link-text");
const viewName = $("#viewname");
const saveViewBtn = $("#save-view-btn");
const copyLinkBtn = $("#copy-link-btn");
const captureViewDiv = $("#capture-view-div");
const saveViewDiv = $("#save-view-div");
const captureModal = $("#modal-action");
const tickBtn = $("#tick-btn");
const tickIcon = $("#tick-icon");

const DISPLAY = "show";
const VISIBLE = "visible";
const INVISIBLE = "invisible";
const ACTIVE_BUTTON = "btn-active";
const COPY_BOOKMARK = "copy-bookmark";
const SELECTED_BUTTON = "selected-button";
const INVALID_FIELD = "is-invalid";
const ACTIVE_BOOKMARK = "active-bookmark";
const INACTIVE_BOOKMARK = "inactive-bookmark";
const CHECKBOX = "input[type=checkbox]";
const SAVE_VIEW_BUTTON_ID = "save-view-btn";
const COPY_LINK_BUTTON_ID = "copy-link-btn";
const listViewsBtn = $("#display-btn");
const bookmarksDropdown = $(".bookmarks-dropdown");
const closeModal = $(".close");
