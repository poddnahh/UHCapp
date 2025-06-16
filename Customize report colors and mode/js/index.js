// index.js
$(document).ready(function () {
    powerbi.bootstrap(embedContainer, { type: "report" });

    // Hide dialogs if needed
    distributionDialog?.hide?.();
    dialogMask?.hide?.();
    sendDialog?.hide?.();
    successDialog?.hide?.();

    loadFirstReport();

    $(".input-content").focus(function () {
        $(this).select();
    });
});

// Load first report from reportList.json
async function loadFirstReport() {
    try {
        const response = await fetch("reportList.json");
        const reportList = await response.json();
        const firstReport = reportList[0];

        if (!firstReport || !firstReport.embedUrl) {
            throw new Error("No valid report URL found.");
        }

        embedReport(firstReport.embedUrl);
    } catch (error) {
        console.error("Failed to load reportList.json:", error);
        overlay.hide();
    }
}

// Embed public Power BI report (no access token)
function embedReport(embedUrl) {
    const models = window["powerbi-client"].models;

    const config = {
        type: "report",
        tokenType: models.TokenType.Embed, // Correct for public report
        accessToken: "", // Empty for public reports
        embedUrl: embedUrl,
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

    const report = powerbi.embed(embedContainer, config);

    report.off("loaded");
    report.on("loaded", () => {
        overlay.hide();
        $("#main-div").show();
        console.log("Report loaded successfully");
    });

    report.off("rendered");
    report.on("rendered", () => {
        console.log("Report rendered successfully");
    });

    // Optional: Make it accessible
    report.setComponentTitle?.("Insight to Action report");
    report.setComponentTabIndex?.(0);
}
