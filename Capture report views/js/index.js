// ----------------------------------------------------------------------------
// Working index.js for public Power BI embed with reportList.json (no token)
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
    const config = {
        type: "report",
        embedUrl: embedUrl,
        settings: {
            panes: {
                filters: { visible: true },
                pageNavigation: { visible: true }
            },
            layoutType: powerbi.models.LayoutType.Custom,
            customLayout: {
                displayOption: powerbi.models.DisplayOption.FitToWidth
            }
        }
    };

    const reportContainer = document.getElementById("report-container");

    // Clear any previous embeds
    powerbi.reset(reportContainer);

    // Embed the public report (view-only)
    powerbi.embed(reportContainer, config);

    // Hide overlay spinner if present
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
}
