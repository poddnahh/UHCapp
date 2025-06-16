// globals.js

// For public reports we don’t need accessToken
const reportConfig = {
    embedUrl: null,
    reportId: null
};

const reportShowcaseState = {
    report: null
};

// Elements
const embedContainer = document.getElementById("report-container");
const overlay = document.getElementById("overlay");

// Load reportList.json and set first report
async function loadReportIntoSession() {
    try {
        const response = await fetch("reportList.json");
        const reportList = await response.json();

        if (reportList.length === 0) throw new Error("No reports found in reportList.json");

        const firstReport = reportList[0];

        reportConfig.embedUrl = firstReport.embedUrl;
        reportConfig.reportId = null; // Optional for public report URLs
    } catch (error) {
        console.error("Error loading report list:", error);
    }
}

