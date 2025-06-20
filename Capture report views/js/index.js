// -----------------------------------------------------------------------------
// Capture Report Views with Embed Token (App Owns Data)
// -----------------------------------------------------------------------------

$(document).ready(function () {
  powerbi.bootstrap(reportContainer, reportConfig);

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

  embedPowerBIReport();
});

async function embedPowerBIReport() {
  const models = window['powerbi-client'].models;

  // ✅ Replace these with your working values
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWIxOTRlMDEtNmRjNy00YzZhLWJiYjEtNjhjMTJjNzQ0Yjk3LyIsImlhdCI6MTc1MDQ1OTI2NCwibmJmIjoxNzUwNDU5MjY0LCJleHAiOjE3NTA0NjMzNTQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUF4SFFEZEFYOUdob1VZSE5HYS9jSmNUc01ZSXZ0Y21VZUJSKzYrdzJVcWZ0dCt0eGQ0ZGJ2Z2NzVVBLWHlUckoybXQ4T3ZFeGo2NzVESXpzWHZHR3U5eWJJOU5nY1ZFaFByUkpzVWZ3VGhoYy82dVk4UjIvVVdYMXdmYzlrSnNZajg4MFQzMDg3dDZJTnZqN2t0Njh1VVE9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJhODhhMTlhNC0yY2RhLTQ1NmMtOWZkYy05MjE4ZDAwMjdlZTIiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IkJpbGxpb3QiLCJnaXZlbl9uYW1lIjoiS2lyYnkiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI1NC44Ni41MC4xMzkiLCJuYW1lIjoiS2lyYnkgQmlsbGlvdCIsIm9pZCI6IjVhNzdjMGI3LTI4ZjAtNGFmMy04MGIxLWFjNmQwMTAxYzc2ZCIsInB1aWQiOiIxMDAzMjAwMDQ3NDhFNUZEIiwicmgiOiIxLkFUWUFBVTRacThkdGFreTdzV2pCTEhSTGx3a0FBQUFBQUFBQXdBQUFBQUFBQUFBMkFDODJBQS4iLCJzY3AiOiJEYXRhc2V0LlJlYWQuQWxsIFJlcG9ydC5SZWFkLkFsbCBUZW5hbnQuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIiwic2lkIjoiMDA1ZWEyYTktOTU0OS1lOTIwLWQ0NDMtZjM1MmQxYmI2YzVjIiwic3ViIjoiRVViaFVXSDBVdG9SeUU3WFBLYVY5NkZXd1FWcEtZTl9XUjBXdk01R3k4VSIsInRpZCI6ImFiMTk0ZTAxLTZkYzctNGM2YS1iYmIxLTY4YzEyYzc0NGI5NyIsInVuaXF1ZV9uYW1lIjoiS2lyYnkuQmlsbGlvdEBzaGVsbGtleS5jb21wYW55IiwidXBuIjoiS2lyYnkuQmlsbGlvdEBzaGVsbGtleS5jb21wYW55IiwidXRpIjoia2VnWndWc1lWMC1OUjdmNzZCb1JBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiNjkwOTEyNDYtMjBlOC00YTU2LWFhNGQtMDY2MDc1YjJhN2E4IiwiNzI5ODI3ZTMtOWMxNC00OWY3LWJiMWItOTYwOGYxNTZiYmI4IiwiZmU5MzBiZTctNWU2Mi00N2RiLTkxYWYtOThjM2E0OWEzOGIxIiwiZjI4YTFmNTAtZjZlNy00NTcxLTgxOGItNmExMmYyYWY2YjZjIiwiZjAyM2ZkODEtYTYzNy00YjU2LTk1ZmQtNzkxYWMwMjI2MDMzIiwiNWYyMjIyYjEtNTdjMy00OGJhLThhZDUtZDQ3NTlmMWZkZTZmIiwiOTY2NzA3ZDAtMzI2OS00NzI3LTliZTItOGMzYTEwZjE5YjlkIiwiYjBmNTQ2NjEtMmQ3NC00YzUwLWFmYTMtMWVjODAzZjEyZWZlIiwiZmRkN2E3NTEtYjYwYi00NDRhLTk4NGMtMDI2NTJmZThmYTFjIiwiYjFiZTFjM2UtYjY1ZC00ZjE5LTg0MjctZjZmYTBkOTdmZWI5IiwiYTllYTg5OTYtMTIyZi00Yzc0LTk1MjAtOGVkY2QxOTI4MjZjIiwiOWI4OTVkOTItMmNkMy00NGM3LTlkMDItYTZhYzJkNWVhNWMzIiwiMzhhOTY0MzEtMmJkZi00YjRjLThiNmUtNWQzZDhhYmFjMWE0IiwiNzQ5NWZkYzQtMzRjNC00ZDE1LWEyODktOTg3ODhjZTM5OWZkIiwiNGQ2YWMxNGYtMzQ1My00MWQwLWJlZjktYTNlMGM1Njk3NzNhIiwiZjcwOTM4YTAtZmMxMC00MTc3LTllOTAtMjE3OGY4NzY1NzM3IiwiMTczMTU3OTctMTAyZC00MGI0LTkzZTAtNDMyMDYyY2FjYTE4IiwiOTVlNzkxMDktOTVjMC00ZDhlLWFlZTMtZDAxYWNjZjJkNDdiIiwiZTg2MTFhYjgtYzE4OS00NmU4LTk0ZTEtNjAyMTNhYjFmODE0IiwiMmI3NDViZGYtMDgwMy00ZDgwLWFhNjUtODIyYzQ0OTNkYWFjIiwiNzY5OGE3NzItNzg3Yi00YWM4LTkwMWYtNjBkNmIwOGFmZmQyIiwiYmUyZjQ1YTEtNDU3ZC00MmFmLWEwNjctNmVjMWZhNjNiYzQ1IiwiMTU4YzA0N2EtYzkwNy00NTU2LWI3ZWYtNDQ2NTUxYTZiNWY3IiwiMTE2NDg1OTctOTI2Yy00Y2YzLTljMzYtYmNlYmIwYmE4ZGNjIiwiNWQ2YjZiYjctZGU3MS00NjIzLWI0YWYtOTYzODBhMzUyNTA5IiwiYmFmMzdiM2EtNjEwZS00NWRhLTllNjItZDlkMWU1ZTg5MTRiIiwiZTZkMWEyM2EtZGExMS00YmU0LTk1NzAtYmVmYzg2ZDA2N2E3IiwiZmNmOTEwOTgtMDNlMy00MWE5LWI1YmEtNmYwZWM4MTg4YTEyIiwiNWM0ZjlkY2QtNDdkYy00Y2Y3LThjOWEtOWU0MjA3Y2JmYzkxIiwiY2YxYzM4ZTUtMzYyMS00MDA0LWE3Y2ItODc5NjI0ZGNlZDdjIiwiNzRlZjk3NWItNjYwNS00MGFmLWE1ZDItYjk1MzlkODM2MzUzIiwiODgzNTI5MWEtOTE4Yy00ZmQ3LWE5Y2UtZmFhNDlmMGNmN2Q5IiwiNGE1ZDhmNjUtNDFkYS00ZGU0LTg5NjgtZTAzNWI2NTMzOWNmIiwiNzU5NDEwMDktOTE1YS00ODY5LWFiZTctNjkxYmZmMTgyNzllIiwiN2JlNDRjOGEtYWRhZi00ZTJhLTg0ZDYtYWIyNjQ5ZTA4YTEzIiwiMTk0YWU0Y2ItYjEyNi00MGIyLWJkNWItNjA5MWIzODA5NzdkIiwiNDQzNjcxNjMtZWJhMS00NGMzLTk4YWYtZjU3ODc4NzlmOTZhIiwiMDk2NGJiNWUtOWJkYi00ZDdiLWFjMjktNThlNzk0ODYyYTQwIiwiYWMxNmU0M2QtN2IyZC00MGUwLWFjMDUtMjQzZmYzNTZhYjViIiwiM2EyYzYyZGItNTMxOC00MjBkLThkNzQtMjNhZmZlZTVkOWQ1IiwiNzkwYzFmYjktN2Y3ZC00Zjg4LTg2YTEtZWYxZjk1YzA1YzFiIiwiYzRlMzliZDktMTEwMC00NmQzLThjNjUtZmIxNjBkYTAwNzFmIiwiMjkyMzJjZGYtOTMyMy00MmZkLWFkZTItMWQwOTdhZjNlNGRlIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19mdGQiOiJDanZFN09PdWZ5aEJfRHgycS1LU241Qm91bUU2YVVBY2RxOWduT2w3SFNVQmRYTnViM0owYUMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxIDEwIiwieG1zX3BsIjoiZW4tVVMifQ.ViYY-k-CowqzkUhpsgqM2K1n7vzgDA33zq0_8p_oVr8demu-co3Gfm1RYBXjENB5yiAabFSXr4x8ZkuiR8R3w8MzZjXPNw3Wr5MbfEyEm0teluqrVYXmFmi6cE31LjuYX6KfgJRM_r7osANCvpRyiSa2EezGXz0fL0zF2ZIzF8v8DZ5cVvgN-TwtPc-pRVNpSc1Qd4xXgmlBCbutgRoMQl1NWqyfleLBNiH0j9bsgMk_SvGSeXe72uBFr_hYzRxwAVqyShU5_nL9U7rLTOJeNNMFhHKtUh7WCYaUsEvduqOw0S-9Mpk2MjYkjTQ94r2-mSpmZ4jpzK1bN_OK2BlmIw";
  const reportId = "69efae40-1fb2-4f69-936d-4e6d9c6d40fd";
  const groupId = "1c4340de-2a85-40e5-8eb0-4f295368978b";

  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`;

  const reportConfig = {
    type: "report",
    tokenType: models.TokenType.Embed,
    accessToken: accessToken,
    embedUrl: embedUrl,
    id: reportId,
    permissions: models.Permissions.All,
    settings: {
      panes: {
        filters: { visible: true },
        pageNavigation: { visible: true }
      },
      layoutType: models.LayoutType.Custom,
      customLayout: { displayOption: models.DisplayOption.FitToWidth }
    }
  };

  const reportContainer = document.getElementById("report-container");
  const report = powerbi.embed(reportContainer, reportConfig);
  bookmarkShowcaseState.report = report;

  report.setComponentTitle("Capture Report Views");
  report.setComponentTabIndex(0);

  report.on("loaded", async () => {
    const bookmarks = await report.bookmarksManager.getBookmarks();
    createBookmarksList(bookmarks);
    $("#overlay").addClass("invisible");
    $("#main-div").addClass("visible");
  });

  report.on("error", (event) => {
    console.error("Power BI Report Error:", event.detail);
  });
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
