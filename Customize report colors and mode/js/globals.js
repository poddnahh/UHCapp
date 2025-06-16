// globals.js

// Global config for report
const reportConfig = {
    embedUrl: null
};

const reportShowcaseState = {
    report: null
};

// This function loads reportList.json and sets the first report's URL
async function loadReportIntoSession() {
    try {
        const response = await fetch('reportList.json');
        const reports = await response.json();

        if (reports && reports.length > 0) {
            reportConfig.embedUrl = reports[0].embedUrl;
            console.log("Loaded report URL:", reportConfig.embedUrl);
        } else {
            console.error("reportList.json is empty or missing.");
        }
    } catch (error) {
        console.error("Failed to load reportList.json:", error);
    }
}
