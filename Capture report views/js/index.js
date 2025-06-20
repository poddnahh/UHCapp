// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

$(document).ready(function () {
    powerbi.bootstrap(reportContainer, reportConfig);
    embedBookmarksReport();

    $("input:text").focus(function () { $(this).select(); });

    $("#close-btn").click(function () {
        listViewsBtn.focus();
        bookmarksList.removeClass(DISPLAY);
        bookmarksDropdown.removeClass(DISPLAY);
        document.getElementById("display-btn").setAttribute("aria-expanded", false);
    });

    $("#close-btn").on("keydown", function (e) {
        if (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB) {
            if (!e.shiftKey) {
                const activeLabel = document.getElementsByClassName(ACTIVE_BOOKMARK);
                const activeCheckbox = $(activeLabel).find(CHECKBOX);
                activeCheckbox.focus();
                e.preventDefault();
            } else {
                $("#close-btn").click();
                e.preventDefault();
            }
        }
    });

    copyLinkBtn.click(function () {
        modalButtonClicked(this);
        createLink();
    });

    copyBtn.click(function () {
        copyLink(this);
    });

    saveViewBtn.click(function () {
        modalButtonClicked(this);
    });

    viewName.on("focus", function () {
        viewName.removeClass(INVALID_FIELD);
    });

    $("#save-bookmark-btn").click(function () {
        onBookmarkCaptureClicked();
    });

    $("form").submit(function () { return false; });

    $("#close-btn").on("focus", clearFocus);

    bookmarksDropdown.on("hidden.bs.dropdown", function () {
        listViewsBtn.focus();
        clearFocus();
    });

    bookmarksDropdown.on("shown.bs.dropdown", function () {
        $("#close-btn").focus();
    });

    captureModal.on("shown.bs.modal", function () {
        closeModal.focus();
    });

    captureModal.on("keydown", function (e) {
        let visibleDiv = saveViewDiv.is(":visible");
        lastActiveElement = visibleDiv ? captureModalElements.lastElement.saveView : captureModalElements.lastElement.copyLink;

        if (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB) {
            if (e.shiftKey) {
                if ($(document.activeElement)[0].id === captureModalElements.firstElement[0].id) {
                    lastActiveElement.focus();
                    e.preventDefault();
                }
            } else {
                if ($(document.activeElement)[0].id === lastActiveElement[0].id) {
                    captureModalElements.firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    captureModal.on("hidden.bs.modal", function () {
        $(this).find("input").val("").end();
        copyLinkSuccessMsg.removeClass(VISIBLE).addClass(INVISIBLE);
        copyLinkBtn.removeClass(ACTIVE_BUTTON);
        saveViewBtn.addClass(ACTIVE_BUTTON);
        copyBtn.removeClass(SELECTED_BUTTON).addClass(COPY_BOOKMARK);
        captureViewDiv.hide();
        tickIcon.hide();
        tickBtn.show();
        viewName.removeClass(INVALID_FIELD);
        saveViewDiv.show();
        $("#capture-btn").focus();
    });
});

$(document).on("click", ".allow-focus", function (element) {
    element.stopPropagation();
});

$(document).on("mouseenter", ".text-truncate", function () {
    const element = $(this);
    if (this.offsetWidth < this.scrollWidth && !element.prop("title")) {
        element.prop("title", element.text());
    }
});

$(document).on("focus", "input:checkbox", function () {
    clearFocus();
    this.parentElement.classList.add(FOCUSED);
});

$(document).on("click", "input:checkbox", function () {
    if (!checkBoxState) {
        clearFocus();
    }
    checkBoxState = null;
});

function clearFocus() {
    const labels = document.getElementsByClassName("showcase-checkbox-container");
    Array.from(labels).forEach(label => {
        label.classList.remove(FOCUSED);
    });
}

function setReportAccessibilityProps(report) {
    report.setComponentTitle("Playground showcase sample report");
    report.setComponentTabIndex(0);
}

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
                filters: { expanded: false, visible: true },
                pageNavigation: { visible: false }
            },
            layoutType: models.LayoutType.Custom,
            customLayout: { displayOption: models.DisplayOption.FitToWidth }
        }
    };

    bookmarkShowcaseState.report = powerbi.embed(reportContainer, config);
    setReportAccessibilityProps(bookmarkShowcaseState.report);

    bookmarkShowcaseState.report.off("loaded");
    bookmarkShowcaseState.report.on("loaded", async function () {
        const bookmarks = await bookmarkShowcaseState.report.bookmarksManager.getBookmarks();
        createBookmarksList(bookmarks);
        overlay.addClass(INVISIBLE);
        $("#main-div").addClass(VISIBLE);
    });

    bookmarkShowcaseState.report.off("rendered");
    bookmarkShowcaseState.report.on("rendered", function () {
        bookmarkShowcaseState.report.off("rendered");
        console.log("The captured views report rendered successfully");
        try {
            if (window.parent.playground && window.parent.playground.logShowcaseDoneRendering) {
                window.parent.playground.logShowcaseDoneRendering("CaptureReportViews");
            }
        } catch {}
    });
}

function createBookmarksList(bookmarks) {
    bookmarkShowcaseState.nextBookmarkId = 1;
    bookmarkShowcaseState.bookmarks = bookmarks;
    bookmarks.forEach(function (element) {
        bookmarksList.append(buildBookmarkElement(element));
    });
    if (bookmarksList.length) {
        onBookmarkClicked($("#" + bookmarks[0].name)[0]);
    }
}

function buildBookmarkElement(bookmark) {
    let label = document.createElement("label");
    label.className = "showcase-checkbox-container";
    label.setAttribute("role", "menuitem");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.name = "bookmark";
    input.id = bookmark.name;
    input.onclick = function () { onBookmarkClicked(this); };

    label.appendChild(input);
    label.appendChild(Object.assign(document.createElement("span"), { className: "showcase-checkmark" }));
    let span2 = document.createElement("span");
    span2.className = "checkbox-title text-truncate";
    span2.appendChild(document.createTextNode(bookmark.displayName));
    label.appendChild(span2);

    return label;
}

function onBookmarkClicked(element) {
    setBookmarkActive($(element));
    applyColor(element.id);
    let current = getBookmarkByID($(element).attr("id"));
    bookmarkShowcaseState.report.bookmarksManager.applyState(current.state);
}

function setBookmarkActive(selector) {
    $("input:checkbox").prop("checked", false);
    selector.prop("checked", true);
}

function applyColor(id) {
    bookmarksList.find(CHECKBOX).each(function () {
        $(this.parentNode).toggleClass(ACTIVE_BOOKMARK, this.id === id).toggleClass(INACTIVE_BOOKMARK, this.id !== id);
    });
}

function getBookmarkByID(id) {
    return bookmarkShowcaseState.bookmarks.find(b => b.name === id);
}

async function onBookmarkCaptureClicked() {
    let name = viewName.val().trim();
    if (!name) {
        viewName.addClass(INVALID_FIELD);
        return;
    }

    viewName.removeClass(INVALID_FIELD);
    const captured = await bookmarkShowcaseState.report.bookmarksManager.capture({ personalizeVisuals: true });

    let bookmark = {
        name: "bookmark_" + bookmarkShowcaseState.bookmarkCounter,
        displayName: name,
        state: captured.state
    };

    bookmarksList.append(buildBookmarkElement(bookmark));
    bookmarksList.addClass(DISPLAY);
    bookmarksDropdown.addClass(DISPLAY);
    document.getElementById("display-btn").setAttribute("aria-expanded", true);

    let newId = "bookmark_" + bookmarkShowcaseState.bookmarkCounter;
    setBookmarkActive($("#" + newId));
    applyColor(newId);
    bookmarkShowcaseState.bookmarks.push(bookmark);
    bookmarkShowcaseState.bookmarkCounter++;
    captureModal.modal("hide");
}

function modalButtonClicked(btn) {
    $(this).find("input").val("").end();
    saveViewBtn.removeClass(ACTIVE_BUTTON);
    copyLinkBtn.removeClass(ACTIVE_BUTTON);

    if (btn.id === SAVE_VIEW_BUTTON_ID) {
        saveViewBtn.addClass(ACTIVE_BUTTON);
        copyLinkSuccessMsg.removeClass(VISIBLE).addClass(INVISIBLE);
        tickIcon.hide();
        tickBtn.show();
        captureViewDiv.hide();
        copyBtn.removeClass(SELECTED_BUTTON).addClass(COPY_BOOKMARK);
        viewName.removeClass(INVALID_FIELD);
        saveViewDiv.show();
    } else if (btn.id === COPY_LINK_BUTTON_ID) {
        copyLinkBtn.addClass(ACTIVE_BUTTON);
        saveViewDiv.hide();
        captureViewDiv.show();
    }
}

async function createLink() {
    let url = (window.location != window.parent.location) ? document.referrer : document.location.href;
    const captured = await bookmarkShowcaseState.report.bookmarksManager.capture({ personalizeVisuals: true });
    let bookmark = {
        name: "bookmark_" + bookmarkShowcaseState.bookmarkCounter,
        state: captured.state
    };
    let shareUrl = url.substring(0, url.lastIndexOf("/")) + "/share_bookmark.html?id=" + bookmark.name;
    localStorage.setItem(bookmark.name, bookmark.state);
    copyLinkText.val(shareUrl);
    bookmarkShowcaseState.bookmarkCounter++;
}

function copyLink(element) {
    $(element).removeClass(COPY_BOOKMARK).addClass(SELECTED_BUTTON);
    tickBtn.hide();
    tickIcon.show();
    copyLinkText.select();
    document.execCommand("copy");
    if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
    copyBtn.focus();
    copyLinkSuccessMsg.removeClass(INVISIBLE).addClass(VISIBLE);
}
