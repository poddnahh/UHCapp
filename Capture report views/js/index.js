// ----------------------------------------------------------------------------
// Working index.js for public Power BI embed with reportList.json
// ----------------------------------------------------------------------------

$(document).ready(function () {
    $("input:text").focus(function () {
        $(this).select();
    });

    // Load and embed the first report from reportList.json
    fetch("reportList.json")
        .then(response => response.json())
        .then(reports => {
            if (!reports || reports.length === 0) return;
            const report = reports[0];
            embedReport(report.embedUrl);
        });
});

function embedReport(embedUrl) {
    const models = window['powerbi-client'].models;

    const config = {
        type: "report",
        tokenType: models.TokenType.Embed, // Use this for public reports
        accessToken: "", // Leave blank for public embed
        embedUrl: embedUrl,
        permissions: models.Permissions.All,
        settings: {
            panes: {
                filters: { visible: true },
                pageNavigation: { visible: true }
            },
            layoutType: models.LayoutType.Custom,
            customLayout: {
                displayOption: models.DisplayOption.FitToWidth
            }
        }
    };

    const reportContainer = document.getElementById("report-container");
    powerbi.embed(reportContainer, config);
    document.getElementById("overlay").style.display = "none";
}
