$(document).ready(function () {
    console.log("DOM ready");

    $("input:text").focus(function () {
        $(this).select();
    });

    fetch("reportList.json")
        .then(response => {
            console.log("reportList.json fetched");
            return response.json();
        })
        .then(reports => {
            if (!reports || reports.length === 0) {
                console.error("No reports found in reportList.json");
                return;
            }
            const report = reports[0];
            console.log("Embedding report:", report.embedUrl);
            embedReport(report.embedUrl);
        })
        .catch(error => {
            console.error("Error loading reportList.json:", error);
        });
});

function embedReport(embedUrl) {
    const reportContainer = document.getElementById("report-container");
    if (!reportContainer) {
        console.error("report-container div not found");
        return;
    }

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

    powerbi.reset(reportContainer);
    const report = powerbi.embed(reportContainer, config);
    console.log("Report embed attempted");

    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
}
