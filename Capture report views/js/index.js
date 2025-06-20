// -----------------------------------------------------------------------------
// Capture Report Views with Azure AD Token (ROPC login, tokenType = Aad)
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

  embedSecurePowerBIReport();
});

async function embedSecurePowerBIReport() {
  const models = window['powerbi-client'].models;

  // ✅ INSERT your Power BI credentials
  const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvYWIxOTRlMDEtNmRjNy00YzZhLWJiYjEtNjhjMTJjNzQ0Yjk3LyIsImlhdCI6MTc1MDQ1MTg4MywibmJmIjoxNzUwNDUxODgzLCJleHAiOjE3NTA0NTU5MTEsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUFqQTcwSXNLRXlwUStXci9YSHFvdm5HcmplbGM1eGI1bkNVclQvakYzQ0NwRkx3RThqT1pTZ215NEdlSE9qbkFqbldCenNSdjVjSUNuR05IaTU0d241KzFzTzBleldXSTVVN0pHWnVuU1lyT1Erck5tTkJUNjhHQVM1d3VCUzE1a0hFNjlqYndPTGIyV2I0UnlxL3I2QlE9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJhODhhMTlhNC0yY2RhLTQ1NmMtOWZkYy05MjE4ZDAwMjdlZTIiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IkJpbGxpb3QiLCJnaXZlbl9uYW1lIjoiS2lyYnkiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI1NC44Ni41MC4xMzkiLCJuYW1lIjoiS2lyYnkgQmlsbGlvdCIsIm9pZCI6IjVhNzdjMGI3LTI4ZjAtNGFmMy04MGIxLWFjNmQwMTAxYzc2ZCIsInB1aWQiOiIxMDAzMjAwMDQ3NDhFNUZEIiwicmgiOiIxLkFUWUFBVTRacThkdGFreTdzV2pCTEhSTGx3a0FBQUFBQUFBQXdBQUFBQUFBQUFBMkFDODJBQS4iLCJzY3AiOiJEYXRhc2V0LlJlYWQuQWxsIFJlcG9ydC5SZWFkLkFsbCBUZW5hbnQuUmVhZC5BbGwgV29ya3NwYWNlLlJlYWQuQWxsIiwic2lkIjoiMDA1ZWEyYTktZWExYy0yNjU3LWMxODUtMWNiNmI4NTU3NzE4Iiwic3ViIjoiRVViaFVXSDBVdG9SeUU3WFBLYVY5NkZXd1FWcEtZTl9XUjBXdk01R3k4VSIsInRpZCI6ImFiMTk0ZTAxLTZkYzctNGM2YS1iYmIxLTY4YzEyYzc0NGI5NyIsInVuaXF1ZV9uYW1lIjoiS2lyYnkuQmlsbGlvdEBzaGVsbGtleS5jb21wYW55IiwidXBuIjoiS2lyYnkuQmlsbGlvdEBzaGVsbGtleS5jb21wYW55IiwidXRpIjoiNzlmMk5yQVBlMEs4ejBwUTBXdzFBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiNjJlOTAzOTQtNjlmNS00MjM3LTkxOTAtMDEyMTc3MTQ1ZTEwIiwiM2EyYzYyZGItNTMxOC00MjBkLThkNzQtMjNhZmZlZTVkOWQ1IiwiYTllYTg5OTYtMTIyZi00Yzc0LTk1MjAtOGVkY2QxOTI4MjZjIiwiYmUyZjQ1YTEtNDU3ZC00MmFmLWEwNjctNmVjMWZhNjNiYzQ1IiwiZTg2MTFhYjgtYzE4OS00NmU4LTk0ZTEtNjAyMTNhYjFmODE0IiwiYWMxNmU0M2QtN2IyZC00MGUwLWFjMDUtMjQzZmYzNTZhYjViIiwiMDk2NGJiNWUtOWJkYi00ZDdiLWFjMjktNThlNzk0ODYyYTQwIiwiMTE2NDg1OTctOTI2Yy00Y2YzLTljMzYtYmNlYmIwYmE4ZGNjIiwiNGE1ZDhmNjUtNDFkYS00ZGU0LTg5NjgtZTAzNWI2NTMzOWNmIiwiNWYyMjIyYjEtNTdjMy00OGJhLThhZDUtZDQ3NTlmMWZkZTZmIiwiNzkwYzFmYjktN2Y3ZC00Zjg4LTg2YTEtZWYxZjk1YzA1YzFiIiwiNzI5ODI3ZTMtOWMxNC00OWY3LWJiMWItOTYwOGYxNTZiYmI4IiwiMTU4YzA0N2EtYzkwNy00NTU2LWI3ZWYtNDQ2NTUxYTZiNWY3IiwiOTY2NzA3ZDAtMzI2OS00NzI3LTliZTItOGMzYTEwZjE5YjlkIiwiNWM0ZjlkY2QtNDdkYy00Y2Y3LThjOWEtOWU0MjA3Y2JmYzkxIiwiZjI4YTFmNTAtZjZlNy00NTcxLTgxOGItNmExMmYyYWY2YjZjIiwiN2JlNDRjOGEtYWRhZi00ZTJhLTg0ZDYtYWIyNjQ5ZTA4YTEzIiwiZmNmOTEwOTgtMDNlMy00MWE5LWI1YmEtNmYwZWM4MTg4YTEyIiwiMjkyMzJjZGYtOTMyMy00MmZkLWFkZTItMWQwOTdhZjNlNGRlIiwiNzU5NDEwMDktOTE1YS00ODY5LWFiZTctNjkxYmZmMTgyNzllIiwiNGQ2YWMxNGYtMzQ1My00MWQwLWJlZjktYTNlMGM1Njk3NzNhIiwiMmI3NDViZGYtMDgwMy00ZDgwLWFhNjUtODIyYzQ0OTNkYWFjIiwiOWI4OTVkOTItMmNkMy00NGM3LTlkMDItYTZhYzJkNWVhNWMzIiwiNzY5OGE3NzItNzg3Yi00YWM4LTkwMWYtNjBkNmIwOGFmZmQyIiwiNWQ2YjZiYjctZGU3MS00NjIzLWI0YWYtOTYzODBhMzUyNTA5IiwiNzQ5NWZkYzQtMzRjNC00ZDE1LWEyODktOTg3ODhjZTM5OWZkIiwiNjkwOTEyNDYtMjBlOC00YTU2LWFhNGQtMDY2MDc1YjJhN2E4IiwiNzRlZjk3NWItNjYwNS00MGFmLWE1ZDItYjk1MzlkODM2MzUzIiwiZjAyM2ZkODEtYTYzNy00YjU2LTk1ZmQtNzkxYWMwMjI2MDMzIiwiNDQzNjcxNjMtZWJhMS00NGMzLTk4YWYtZjU3ODc4NzlmOTZhIiwiY2YxYzM4ZTUtMzYyMS00MDA0LWE3Y2ItODc5NjI0ZGNlZDdjIiwiYjFiZTFjM2UtYjY1ZC00ZjE5LTg0MjctZjZmYTBkOTdmZWI5IiwiODgzNTI5MWEtOTE4Yy00ZmQ3LWE5Y2UtZmFhNDlmMGNmN2Q5IiwiYmFmMzdiM2EtNjEwZS00NWRhLTllNjItZDlkMWU1ZTg5MTRiIiwiMTk0YWU0Y2ItYjEyNi00MGIyLWJkNWItNjA5MWIzODA5NzdkIiwiZjcwOTM4YTAtZmMxMC00MTc3LTllOTAtMjE3OGY4NzY1NzM3IiwiMzhhOTY0MzEtMmJkZi00YjRjLThiNmUtNWQzZDhhYmFjMWE0IiwiYjBmNTQ2NjEtMmQ3NC00YzUwLWFmYTMtMWVjODAzZjEyZWZlIiwiZTZkMWEyM2EtZGExMS00YmU0LTk1NzAtYmVmYzg2ZDA2N2E3IiwiYzRlMzliZDktMTEwMC00NmQzLThjNjUtZmIxNjBkYTAwNzFmIiwiMTczMTU3OTctMTAyZC00MGI0LTkzZTAtNDMyMDYyY2FjYTE4IiwiZmRkN2E3NTEtYjYwYi00NDRhLTk4NGMtMDI2NTJmZThmYTFjIiwiZmU5MzBiZTctNWU2Mi00N2RiLTkxYWYtOThjM2E0OWEzOGIxIiwiOTVlNzkxMDktOTVjMC00ZDhlLWFlZTMtZDAxYWNjZjJkNDdiIiwiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19mdGQiOiJ1OUFjeWhZdEkxUzA3eWVNeVUzVFZEeDNBRWJmWXFVUU1aWHA2WmNUUTEwQmRYTjNaWE4wTXkxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxMiAxIiwieG1zX3BsIjoiZW4tVVMifQ.My4Bafh_7BO9qjfvKYHQsCw_3NriiqhQAIGdxh7JKKjpsU82dlcBGS8rtafKNLKFPPqjHktXIAoOCxwTg_5yC1vqfxmJ5P7dD62_7yX6nSCG_uorE_gtu69Sko_4LedqqiHhPTwA0yQmSDPuQJN2lYckcxqg4pIlQyl0EG5TCFpCdhIkOR6PIyRO5kjic8z1Fn_3Th2vAbKOUz2jFuTaWspV4GAn6HsYU0vk1-CKR_3NGj2KTBdNoDTx0xGDOJSAge-aH_YPhipeG2oQxWpEGp0OWtLmMGTp8S6hG3Ki0te8U2JNx8ORUzoF14PfWEUkugf6KBLYooxR396dwtgY_Q"; // replace with latest
  const reportId = "69efae40-1fb2-4f69-936d-4e6d9c6d40fd";
  const groupId = "1c4340de-2a85-40e5-8eb0-4f295368978b";

  const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${groupId}`;

  const config = {
    type: "report",
    tokenType: models.TokenType.Aad, // ✅ ROPC or Azure AD token = Aad
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

  const report = powerbi.embed(reportContainer, config);
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
