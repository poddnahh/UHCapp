// ----------------------------------------------------------------------------
// Updated for public Power BI report embedding using reportList.json
// ----------------------------------------------------------------------------

$(document).ready(async function () {
    powerbi.bootstrap(embedContainer, { "type": "report" });

    distributionDialog.hide();
    dialogMask.hide();
    sendDialog.hide();
    successDialog.hide();

    await embedReport();

    closeBtn1.on("click", onCloseClicked);
    closeBtn2.on("click", onCloseClicked);
    successCross.on("click", onCloseClicked);

    sendDiscountBtn.on("click", () => onSendClicked("discount"));
    sendCouponBtn.on("click", () => onSendClicked("coupon"));

    sendMessageBtn.on("click", function () {
        onSendDialogSendClicked();
        setTimeout(() => {
            if (!isDialogClosed) {
                onCloseClicked();
            }
        }, 3000);
    });

    $(".input-content").focus(function () { $(this).select(); });

    successDialog.on("keydown", event => handleKeyEvents(event, successDialogElements));
    distributionDialog.on("keydown", event => handleKeyEvents(event, distributionDialogElements));
    sendDialog.on("keydown", event => handleKeyEvents(event, sendDialogElements));
});

function handleKeyEvents(event, elements) {
    if (event.key === "Escape") {
        onCloseClicked();
        return;
    }
    if (event.key === "Tab") {
        if (event.shiftKey) {
            if ($(document.activeElement)[0].id === elements.firstElement[0].id) {
                elements.lastElement.focus();
                event.preventDefault();
            }
        } else {
            if ($(document.activeElement)[0].id === elements.lastElement[0].id) {
                elements.firstElement.focus();
                event.preventDefault();
            }
        }
    }
}

function setReportAccessibilityProps(report) {
    report.setComponentTitle("Insight to Action report");
    report.setComponentTabIndex(0);
}

async function embedReport() {
    const response = await fetch("reportList.json");
    const reports = await response.json();

    if (!reports || reports.length === 0) {
        console.error("No reports found in reportList.json");
        return;
    }

    const firstReport = reports[0];
    const models = window["powerbi-client"].models;

    const config = {
        type: "report",
        tokenType: models.TokenType.Aad,
        accessToken: null, // public embedding
        embedUrl: firstReport.embedUrl,
        id: null, // not required for public URL
        settings: {
            panes: {
                filters: { visible: false },
                pageNavigation: { visible: false }
            },
            layoutType: models.LayoutType.Custom,
            customLayout: {
                displayOption: models.DisplayOption.FitToWidth
            }
        }
    };

    reportShowcaseState.report = powerbi.embed(embedContainer, config);

    setReportAccessibilityProps(reportShowcaseState.report);

    reportShowcaseState.report.off("loaded");
    reportShowcaseState.report.on("loaded", () => {
        overlay.hide();
        $("#main-div").show();
    });

    reportShowcaseState.report.off("rendered");
    reportShowcaseState.report.on("rendered", () => {
        console.log("Public report rendered.");
    });
}

function onSendClicked(name) {
    const headerText = document.createTextNode("Send " + name + " to distribution list");
    $("#send-dialog .text-dialog-header").empty().append(headerText);
    $("#send-dialog .title").val("Special offer just for you");

    const promo = name === "coupon" ? "30$ coupon" : "10% discount";
    $("#send-dialog textarea").val("Hi <customer name>, get your " + promo + " today!");

    distributionDialog.hide();
    successDialog.hide();
    dialogMask.show();
    sendDialog.show();
    closeBtn2.focus();
}

function handleExportData(result) {
    const data = parseData(result.data);
    reportShowcaseState.data = filterTable(["Latest Purchase Category", "Total spend ($)", "Days since last purchase"], data);
    const table = createTable(reportShowcaseState.data);
    $("#dialog-table").empty().append(table);
}

function onStartCampaignClicked() {
    $(".checkbox-element").prop("checked", true);
    body.addClass(HIDE_OVERFLOW);
    successDialog.hide();
    sendDialog.hide();
    dialogMask.show();
    distributionDialog.show();
    closeBtn1.focus();
}

function onSendDialogSendClicked() {
    distributionDialog.hide();
    sendDialog.hide();
    dialogMask.show();
    successDialog.show();
    successCross.focus();
    isDialogClosed = false;
}

function onCloseClicked() {
    body.removeClass(HIDE_OVERFLOW);
    dialogMask.hide();
    successDialog.hide();
    sendDialog.hide();
    distributionDialog.hide();
    isDialogClosed = true;
}

function parseData(data) {
    return data.split("\n").filter(row => row).map(row => row.split(","));
}

function filterTable(filterValues, table) {
    filterValues.forEach(value => {
        const index = table[0].indexOf(value);
        if (index > -1) {
            table.forEach(row => row.splice(index, 1));
        }
    });
    return table;
}

function createTable(data) {
    const table = document.createElement("table");
    const body = document.createElement("tbody");

    data.forEach((rowData, i) => {
        const row = document.createElement("tr");
        row.className = "table-row";

        if (i !== 0) {
            const checkboxTd = document.createElement("td");
            checkboxTd.className = "cell-checkbox";

            const label = document.createElement("label");
            label.className = "table-checkbox";
            label.setAttribute("aria-label", "Include " + rowData[0]);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox-element";
            checkbox.name = "table-row-checkbox";
            checkbox.id = "row" + i;
            checkbox.checked = true;

            const span1 = document.createElement("span");
            span1.className = "checkbox-circle";

            const span2 = document.createElement("span");
            span2.className = "checkbox-checkmark";

            label.append(checkbox, span1, span2);
            checkboxTd.append(label);
            row.append(checkboxTd);
        }

        rowData.forEach((cellData, j) => {
            const cell = document.createElement(i === 0 ? "th" : "td");
            const classes = ["name-cell", "region-cell", "mail-cell", "phone-cell"];
            if (i !== 0) cell.className = classes[j] || "";
            else cell.id = classes[j] ? classes[j].replace("-cell", "") : "";
            cell.append(document.createTextNode(cellData));
            row.append(cell);
        });

        body.append(row);
    });

    table.append(body);
    return table;
}
