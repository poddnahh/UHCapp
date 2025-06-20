// -----------------------------------------------------------------------------
// Microsoft Original Bookmark Sample - RESTORED for custom layout integration
// -----------------------------------------------------------------------------

$(document).ready(function () {
  powerbi.bootstrap(reportContainer, reportConfig);
  embedBookmarksReport();

  $("input:text").focus(function () {
    $(this).select();
  });

  $("#save-bookmark-btn").click(onBookmarkCaptureClicked);
  $("#copy-link-btn").click(() => {
    modalButtonClicked(document.getElementById("copy-link-btn"));
    createLink();
  });
  $("#save-view-btn").click(() =>
    modalButtonClicked(document.getElementById("save-view-btn"))
  );
  $("#copy-btn").click(() => copyLink(document.getElementById("copy-btn")));

  $("#modal-action").on("hidden.bs.modal", () => {
    $("#viewname").val("").removeClass("is-invalid");
    $("#copy-link-text").val("");
    $("#copy-link-success-msg").removeClass("visible").addClass("invisible");
    $("#copy-link-btn").removeClass("btn-active");
    $("#save-view-btn").addClass("btn-active");
    $("#copy-btn").removeClass("selected-button").addClass("copy-bookmark");
    $("#capture-view-div").hide();
    $("#tick-icon").hide();
    $("#tick-btn").show();
    $("#save-view-div").show();
    $("#capture-btn").focus();
  });
});

async function embedBookmarksReport() {
  await loadSampleReportIntoSession();
  const models = window["powerbi-client"].models;

  let config = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: reportConfig.accessToken,
    embedUrl: reportConfig.embedUrl,
    id: reportConfig.reportId,
    permissions: models.Permissions.View,
    settings: {
      panes: {
        filters: { visible: true, expanded: false },
        pageNavigation: { visible: false }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    }
  };

  bookmarkShowcaseState.report = powerbi.embed(reportContainer, config);
  setReportAccessibilityProps(bookmarkShowcaseState.report);

  bookmarkShowcaseState.report.on("loaded", async () => {
    const bookmarks = await bookmarkShowcaseState.report.bookmarksManager.getBookmarks();
    createBookmarksList(bookmarks);
    $("#overlay").addClass("invisible");
    $("#main-div").addClass("visible");
  });
}

function setReportAccessibilityProps(report) {
  report.setComponentTitle("Capture Report Views");
  report.setComponentTabIndex(0);
}

function createBookmarksList(bookmarks) {
  bookmarkShowcaseState.bookmarks = bookmarks;
  $("#bookmarks-list").empty();
  bookmarks.forEach((bookmark) =>
    $("#bookmarks-list").append(buildBookmarkElement(bookmark))
  );
  if (bookmarks.length) {
    onBookmarkClicked(document.getElementById(bookmarks[0].name));
  }
}

function buildBookmarkElement(bookmark) {
  const label = $("<label>", {
    class: "showcase-checkbox-container",
    role: "menuitem"
  });

  $("<input>", {
    type: "checkbox",
    id: bookmark.name,
    name: "bookmark",
    click: function () {
      onBookmarkClicked(this);
    }
  }).appendTo(label);

  $("<span>", { class: "showcase-checkmark" }).appendTo(label);
  $("<span>", {
    class: "checkbox-title text-truncate",
    text: bookmark.displayName
  }).appendTo(label);

  return label;
}

function onBookmarkClicked(element) {
  setBookmarkActive($(element));
  applyColor(element.id);

  const bookmarkId = $(element).attr("id");
  const bookmark = bookmarkShowcaseState.bookmarks.find((b) => b.name === bookmarkId);

  if (bookmark) {
    bookmarkShowcaseState.report.bookmarksManager.applyState(bookmark.state);
  }
}

function setBookmarkActive($el) {
  $("input:checkbox").prop("checked", false);
  $el.prop("checked", true);
}

function applyColor(activeId) {
  $("#bookmarks-list input[type='checkbox']").each(function () {
    const parent = this.parentNode;
    if (this.id === activeId) {
      $(parent).addClass("active-bookmark").removeClass("inactive-bookmark");
    } else {
      $(parent).removeClass("active-bookmark").addClass("inactive-bookmark");
    }
  });
}

async function onBookmarkCaptureClicked() {
  const viewname = $("#viewname").val().trim();
  if (!viewname) {
    $("#viewname").addClass("is-invalid");
    return;
  }

  const bookmark = await bookmarkShowcaseState.report.bookmarksManager.capture({ personalizeVisuals: true });

  const newBookmark = {
    name: "bookmark_" + bookmarkShowcaseState.bookmarkCounter,
    displayName: viewname,
    state: bookmark.state
  };

  $("#bookmarks-list").append(buildBookmarkElement(newBookmark));
  bookmarkShowcaseState.bookmarks.push(newBookmark);
  bookmarkShowcaseState.bookmarkCounter++;

  onBookmarkClicked(document.getElementById(newBookmark.name));
  $("#modal-action").modal("hide");
}

function modalButtonClicked(el) {
  $("#viewname").removeClass("is-invalid");
  $("#copy-link-success-msg").removeClass("visible").addClass("invisible");
  $("#tick-icon").hide();
  $("#tick-btn").show();

  $("#copy-link-btn, #save-view-btn").removeClass("btn-active");
  $(el).addClass("btn-active");

  if (el.id === "copy-link-btn") {
    $("#save-view-div").hide();
    $("#capture-view-div").show();
  } else {
    $("#save-view-div").show();
    $("#capture-view-div").hide();
  }
}

async function createLink() {
  const url = window.location.href.split("?")[0];
  const bookmark = await bookmarkShowcaseState.report.bookmarksManager.capture({ personalizeVisuals: true });

  const name = "bookmark_" + bookmarkShowcaseState.bookmarkCounter;
  localStorage.setItem(name, bookmark.state);
  const link = `${url.replace(/\/$/, "")}/share_bookmark.html?id=${name}`;

  $("#copy-link-text").val(link);
  bookmarkShowcaseState.bookmarkCounter++;
}

function copyLink(el) {
  $(el).removeClass("copy-bookmark").addClass("selected-button");
  $("#tick-btn").hide();
  $("#tick-icon").show();

  const input = document.getElementById("copy-link-text");
  input.select();
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
  $("#copy-link-success-msg").removeClass("invisible").addClass("visible");
}
