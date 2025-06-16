// index.js

$(document).ready(function () {
    powerbi.bootstrap(embedContainer, { "type": "report" });

    // Hide all dialog boxes if they exist (safe even if not used)
    $("#dialog-mask, #distribution-dialog, #send-dialog, #success-dialog").hide();

    // Load and embed report
    embedReport();
});

async function embedReport() {
    await loadReportIntoSession();

    if (!reportConfig.embedUrl) {
        console.error("No embedUrl found in reportConfig.");
        return;
    }

    const models = window["powerbi-client"].models;

    const config = {
        type: "report",
        tokenType: models.TokenType.Aad, // No token needed for public
        accessToken: null,
        embedUrl: reportConfig.embedUrl,
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

    try {
        reportShowcaseState.report = powerbi.embed(embedContainer, config);
        reportShowcaseState.report.on("loaded", () => {
            $("#overlay").hide();
            $("#main-div").show();
            console.log("Public report embedded successfully.");
        });
    } catch (error) {
        console.error("Failed to embed report:", error);
    }
}
