// ----------------------------------------------------------------------------
// Updated Capture Report Views index.js for public Power BI embed using reportList.json
// ----------------------------------------------------------------------------

$(document).ready(function () {
    $("input:text").focus(function () { $(this).select(); });

    // Load and embed the first report from reportList.json
    fetch("reportList.json")
        .then(response => response.json())
        .then(reports => {
            if (!reports || reports.length === 0) return;
            const report = reports[0];
            reportConfig.embedUrl = report.embedUrl;
            reportConfig.reportId = report.reportId || ""; // Optional fallback
            embedBookmarksReport();
        });

    closeBtn.click(() => {
        listViewsBtn.focus();
        bookmarksList.removeClass(DISPLAY);
        bookmarksDropdown.removeClass(DISPLAY);
        $("#display-btn").attr("aria-expanded", false);
    });

    closeBtn.on("keydown", e => {
        if (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB) {
            if (!e.shiftKey) {
                const activeLabel = document.getElementsByClassName(ACTIVE_BOOKMARK);
                const activeCheckbox = $(activeLabel).find(CHECKBOX);
                activeCheckbox.focus();
                e.preventDefault();
            } else {
                closeBtn.click();
                e.preventDefault();
            }
        }
    });

    copyLinkBtn.click(() => modalButtonClicked(copyLinkBtn));
    copyBtn.click(() => copyLink(copyBtn));
    saveViewBtn.click(() => modalButtonClicked(saveViewBtn));
    viewName.on("focus", () => viewName.removeClass(INVALID_FIELD));
    $("#save-bookmark-btn").click(() => onBookmarkCaptureClicked());
    $("form").submit(() => false);
    closeBtn.on("focus", clearFocus);
    bookmarksDropdown.on("hidden.bs.dropdown", () => { listViewsBtn.focus(); clearFocus(); });
    bookmarksDropdown.on("shown.bs.dropdown", () => closeBtn.focus());
    captureModal.on("shown.bs.modal", () => closeModal.focus());

    captureModal.on("keydown", function (e) {
        let visibleDiv = saveViewDiv.is(":visible");
        lastActiveElement = visibleDiv ? captureModalElements.lastElement.saveView : captureModalElements.lastElement.copyLink;

        if (e.key === Keys.TAB || e.keyCode === KEYCODE_TAB) {
            if (e.shiftKey && $(document.activeElement)[0].id === captureModalElements.firstElement[0].id) {
                lastActiveElement.focus(); e.preventDefault();
            } else if (!e.shiftKey && $(document.activeElement)[0].id === lastActiveElement[0].id) {
                captureModalElements.firstElement.focus(); e.preventDefault();
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

// Other listeners
$(document).on("click", ".allow-focus", e => e.stopPropagation());
$(document).on("mouseenter", ".text-truncate", function () {
    const el = $(this);
    if (this.offsetWidth < this.scrollWidth && !el.prop("title")) {
        el.prop("title", el.text());
    }
});
$(document).on("focus", "input:checkbox", function () {
    clearFocus();
    this.parentElement.classList.add(FOCUSED);
});
$(document).on("click", "input:checkbox", function () {
    if (!checkBoxState) clearFocus();
    checkBoxState = null;
});

function clearFocus() {
    const labels = document.getElementsByClassName("showcase-checkbox-container");
    Array.from(labels).forEach(label => label.classList.remove(FOCUSED));
}

function setReportAccessibilityProps(report) {
    report.setComponentTitle("Capture Report Views Sample");
    report.setComponentTabIndex(0);
}

async function embedBookmarksReport() {
    const models = window["powerbi-client"].models;

    let config = {
        type: "report",
        tokenType: models.TokenType.Aad, // Using view-only link doesn't require accessToken
        accessToken: null,
        embedUrl: reportConfig.embedUrl,
        id: reportConfig.reportId,
        permissions: models.Permissions.View,
        settings: {
            panes: {
                filters: { visible: true },
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
        console.log("Report rendered successfully");
    });
}

function createBookmarksList(bookmarks) {
    bookmarkShowcaseState.nextBookmarkId = 1;
    bookmarkShowcaseState.bookmarks = bookmarks;
    bookmarks.forEach(b => bookmarksList.append(buildBookmarkElement(b)));
    if (bookmarksList.length) {
        let firstBookmark = $("#" + bookmarks[0].name);
        onBookmarkClicked(firstBookmark[0]);
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

    let checkmark = document.createElement("span");
    checkmark.className = "showcase-checkmark";
    label.appendChild(checkmark);

    let title = document.createElement("span");
    title.className = "checkbox-title text-truncate";
    title.textContent = bookmark.displayName;
    label.appendChild(title);

    return label;
}

function onBookmarkClicked(el) {
    setBookmarkActive($(el));
    applyColor(el.id);
    const currentBookmark = getBookmarkByID(el.id);
    bookmarkShowcaseState.report.bookmarksManager.applyState(currentBookmark.state);
}

function setBookmarkActive($el) {
    $("input:checkbox").prop("checked", false);
    $el.prop("checked", true);
}

function applyColor(id) {
    bookmarksList.find(CHECKBOX).each(function () {
        const $parent = $(this).parent();
        $parent.toggleClass(ACTIVE_BOOKMARK, this.id === id);
        $parent.toggleClass(INACTIVE_BOOKMARK, this.id !== id);
    });
}

function getBookmarkByID(id) {
    return bookmarkShowcaseState.bookmarks.find(b => b.name === id);
}

async function onBookmarkCaptureClicked() {
    let name = viewName.val().trim();
    if (!name) return viewName.addClass(INVALID_FIELD);
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
    $("#display-btn").attr("aria-expanded", true);
    setBookmarkActive($("#" + bookmark.name));
    applyColor(bookmark.name);

    bookmarkShowcaseState.bookmarks.push(bookmark);
    bookmarkShowcaseState.bookmarkCounter++;
    captureModal.modal("hide");
}

function modalButtonClicked(el) {
    $(this).find("input").val("").end();
    saveViewBtn.removeClass(ACTIVE_BUTTON);
    copyLinkBtn.removeClass(ACTIVE_BUTTON);

    if (el.id === SAVE_VIEW_BUTTON_ID) {
        saveViewBtn.addClass(ACTIVE_BUTTON);
        copyLinkSuccessMsg.removeClass(VISIBLE).addClass(INVISIBLE);
        tickIcon.hide();
        tickBtn.show();
        captureViewDiv.hide();
        copyBtn.removeClass(SELECTED_BUTTON).addClass(COPY_BOOKMARK);
        viewName.removeClass(INVALID_FIELD);
        saveViewDiv.show();
    } else {
        copyLinkBtn.addClass(ACTIVE_BUTTON);
        saveViewDiv.hide();
        captureViewDiv.show();
    }
}

async function createLink() {
    const captured = await bookmarkShowcaseState.report.bookmarksManager.capture({ personalizeVisuals: true });
    let bookmark = {
        name: "bookmark_" + bookmarkShowcaseState.bookmarkCounter,
        state: captured.state
    };

    const baseUrl = location.href.split("/").slice(0, -1).join("/");
    const shareUrl = `${baseUrl}/share_bookmark.html?id=${bookmark.name}`;
    localStorage.setItem(bookmark.name, bookmark.state);

    copyLinkText.val(shareUrl);
    bookmarkShowcaseState.bookmarkCounter++;
}

function copyLink(el) {
    $(el).removeClass(COPY_BOOKMARK).addClass(SELECTED_BUTTON);
    tickBtn.hide();
    tickIcon.show();
    copyLinkText.select();
    document.execCommand("copy");
    if (window.getSelection) window.getSelection().removeAllRanges();
    copyBtn.focus();
    copyLinkSuccessMsg.removeClass(INVISIBLE).addClass(VISIBLE);
}
