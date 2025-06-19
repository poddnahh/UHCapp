const models = window['powerbi-client'].models;
let report;

// Load report on page load
document.addEventListener("DOMContentLoaded", async function () {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";

  try {
    const response = await fetch("./reportList.json");
    const reports = await response.json();

    if (!reports || reports.length === 0) {
      throw new Error("No reports found in reportList.json");
    }

    const reportData = reports[0]; // load the first report for now
    const embedUrl = reportData.url;
    const token = reportData.token || "PASTE_YOUR_TOKEN_HERE"; // fallback if not in JSON

    const embedConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: token,
      embedUrl: embedUrl,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        },
        background: models.BackgroundType.Transparent
      }
    };

    const reportContainer = document.getElementById("report-container");
    powerbi.reset(reportContainer);
    report = powerbi.embed(reportContainer, embedConfig);

    report.on("loaded", () => {
      overlay.style.display = "none";
      console.log("Power BI report loaded successfully");
    });

    report.on("error", (event) => {
      console.error("Power BI report error:", event.detail);
      alert("Failed to load Power BI report.");
    });

  } catch (error) {
    console.error("Error embedding report:", error);
    overlay.style.display = "none";
  }
});

// Capture View using Bookmark state (Power BI API)
async function saveView() {
  if (!report) return;

  const viewName = document.getElementById("viewNameInput").value.trim();
  if (!viewName) return alert("Please enter a name.");

  try {
    const state = await report.bookmarksManager.capture();
    const saved = JSON.parse(localStorage.getItem("savedViews") || "[]");

    saved.push({
      name: viewName,
      bookmarkState: state.state,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem("savedViews", JSON.stringify(saved));
    closeCaptureModal();
    alert("View saved successfully.");
  } catch (err) {
    console.error("Failed to capture view:", err);
  }
}

function applyBookmark(state) {
  if (!report || !state) return;

  report.bookmarksManager.applyState(state)
    .then(() => console.log("Bookmark applied."))
    .catch(err => console.error("Failed to apply bookmark:", err));
}

// Modal controls
function openCaptureModal() {
  document.getElementById("viewNameInput").value = "";
  document.getElementById("captureModal").style.display = "flex";
}

function closeCaptureModal() {
  document.getElementById("captureModal").style.display = "none";
}

function openSavedViewsModal() {
  const list = document.getElementById("savedViewsList");
  const saved = JSON.parse(localStorage.getItem("savedViews") || "[]");

  list.innerHTML = "";
  saved.forEach((view, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${view.name}</strong><br>
      <small>${new Date(view.timestamp).toLocaleString()}</small><br>
      <button onclick="applyBookmark('${view.bookmarkState.replace(/"/g, '&quot;')}')">Apply</button>
      <button onclick="deleteView(${i})">Delete</button><br><br>
    `;
    list.appendChild(li);
  });

  document.getElementById("savedViewsModal").style.display = "flex";
}

function closeSavedViewsModal() {
  document.getElementById("savedViewsModal").style.display = "none";
}

function deleteView(index) {
  const saved = JSON.parse(localStorage.getItem("savedViews") || "[]");
  saved.splice(index, 1);
  localStorage.setItem("savedViews", JSON.stringify(saved));
  openSavedViewsModal();
}

// Optional: share view link (not tied to Power BI)
function copyShareLink() {
  const name = document.getElementById("viewNameInput").value.trim();
  const link = `${window.location.href}#${encodeURIComponent(name)}`;
  navigator.clipboard.writeText(link).then(() => {
    alert("Link copied to clipboard.");
  });
}
