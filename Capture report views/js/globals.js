let reportConfig = {
  accessToken: null,
  embedUrl: null,
  reportId: null,
  type: "report"
};

let bookmarkShowcaseState = {
  report: null,
  bookmarks: [],
  bookmarkCounter: 1
};

// DOM elements
const overlay = $('#overlay');
const reportContainer = $('#report-container').get(0);
const bookmarksList = $('#bookmarks-list');
const viewName = $('#viewname');
const copyLinkText = $('#copy-link-text');
const copyBtn = $('#copy-btn');
const saveViewBtn = $('#save-view-btn');
const copyLinkBtn = $('#copy-link-btn');
const saveBtn = $('#save-bookmark-btn');
const captureViewDiv = $('#capture-view-div');
const saveViewDiv = $('#save-view-div');
const captureModal = $('#modal-action');

// Style helpers
const VISIBLE = "visible";
const INVISIBLE = "invisible";
const COPY_BOOKMARK = "copy-bookmark";
const SELECTED_BUTTON = "selected-button";
const ACTIVE_BUTTON = "btn-active";
const INVALID_FIELD = "is-invalid";
