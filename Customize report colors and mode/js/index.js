// ----------------------------------------------------------------------------
// Updated for public Power BI report embedding using reportList.json
// ----------------------------------------------------------------------------

$(document).ready(function () {
    powerbi.bootstrap(embedContainer, { type: "report" });

    distributionDialog.hide();
    dialogMask.hide();
    sendDialog.hide();
    successDialog.hide();

    loadAndEmbedReport();

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
    if (event.key === "Escape" || event.keyCode === 27) {
        onCloseClicked();
        return;
    }

    if (event.key === "Tab" || event.keyCode === 9) {
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

function onCloseClicked() {
    body.removeClass(HIDE_OVERFLOW);
    dialogMask.hide();
    successDialog.hide();
    sendDialog.hide();
    distributionDialog.hide();
    isDialogClosed = true;
}

function onSendClicked(type) {
    const headerText = document.createTextNode(`Send ${type} to distribution list`);
    $("#send-dialog .text-dialog-header").empty().append(headerText);
    $("#send-dialog .title").val("Special offer just for you");

    const promo = type === "coupon" ? "30$ coupon" : "10% discount";
    $("#send-dialog textarea").val(`Hi <customer name>, get your ${promo} today!`);

    distributionDialog.hide();
    successDialog.hide();
    dialogMask.show();
    sendDialog.show();
    closeBtn2.focus();
}

function onSendDialogSendClicked() {
    distributionDialog.hide();
    sendDialog.hide();
    dialogMask.show();
    successDialog.show();
    successCross.focus();
    isDialogClosed = false;
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

function handleExportData(result) {
    const data = parseData(result.data);
    reportShowcaseState.data = filterTable(
        ["Latest Purchase Category", "Total spend ($)", "Days since last purchase"],
        data
    );
    const table = createTable(reportShowcaseState.data);
    $("#dialog-table").empty().append(table);
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
    const tbody = document.createElement("tbody");

    data.forEach((rowData, i) => {
        const row = document.createElement("tr");
        row.className = "table-row";

        if (i !== 0) {
            const checkboxCell = document.createElement("td");
            checkboxCell.className = "cell-checkbox";

            const label = document.createElement("label");
            label.className = "table-checkbox";
            label.setAttribute("aria-label", `Include ${rowData[0]}`);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox-element";
            checkbox.name = "table-row-checkbox";
            checkbox.id = `row${i}`;
            checkbox.checked = true;

            const span1 = document.createElement("span");
            span1.className = "checkbox-circle";

            const span2 = document.createElement("span");
            span2.className = "checkbox-checkmark";

            label.append(checkbox, span1, span2);
            checkboxCell.append(label);
            row.append(checkboxCell);
        }

        rowData.forEach((cellData, j) => {
            const cell = document.createElement(i === 0 ? "th" : "td");
            if (i === 0) {
                cell.className = "table-headers";
            } else {
                cell.className = ["name-cell", "region-cell", "mail-cell", "phone-cell"][j] || "";
            }
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    return table;
}

// 🔁 Loads the first report from reportList.json
async function loadAndEmbedReport() {
    try {
        const response = await fetch("reportList.json");
        const reportList = await response.json();
        const firstReport = reportList[0];

        if (!firstReport || !firstReport.embedUrl) {
            console.error("No valid report found in reportList.json");
            return;
        }

        const models = window["powerbi-client"].models;

        const config = {
            type: "report",
            tokenType: models.TokenType.Embed,
            accessToken: "", // Not needed for public reports
            embedUrl: firstReport.embedUrl,
            id: null, // Optional for public reports
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
        reportShowcaseState.report.on("loaded", async () => {
            overlay.hide();
            $("#main-div").show();
        });

        reportShowcaseState.report.off("rendered");
        reportShowcaseState.report.on("rendered", () => {
            console.log("Report rendered.");
        });

        // Attach campaign events
        reportShowcaseState.report.on("buttonClicked", async () => {
            const result = await tableVisual.exportData(models.ExportDataType.Underlying);
            handleExportData(result);
            onStartCampaignClicked();
        });

        reportShowcaseState.report.on("commandTriggered", async function (event) {
            if (event.detail.command === "campaign") {
                const result = await tableVisual.exportData(models.ExportDataType.Underlying);
                handleExportData(result);
                onStartCampaignClicked();
            }
        });

    } catch (error) {
        console.error("Failed to load or embed report:", error);
    }
}

function setReportAccessibilityProps(report) {
    report.setComponentTitle("Insight to Action report");
    report.setComponentTabIndex(0);
}
