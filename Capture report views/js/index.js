const models = window['powerbi-client'].models;
let report = null;

document.addEventListener("DOMContentLoaded", async function () {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "flex";

  try {
    const response = await fetch("./reportList.json");
    const reports = await response.json();

    if (!reports || reports.length === 0) throw new Error("No reports found");

    const reportData = reports[0];
    const embedConfig = {
      type: 'report',
      id: reportData.reportId,
      embedUrl: reportData.embedUrl,
      accessToken: reportData.accessToken,
      tokenType: models.TokenType.Embed,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true }
        },
        background: models.BackgroundType.Transparent
      }
    };

    const container = document.getElementById("report-container");
    powerbi.reset(container);
    report = powerbi.embed(container, embedConfig);

    report.on("loaded", () => overlay.style.display = "none");
    report.on("error", e => {
      console.error("Power BI Error:", e.detail);
      alert("Failed to load report.");
    });

  } catch (error) {
    console.error("Embedding error:", error);
    overlay.style.display = "none";
  }
});

async function saveView() {
  if (!report) return;
  const name = document.getElementById("viewNameInput").value.trim();
  if (!name) return alert("Please enter a name.");

  try {
    const state = await report.bookmarksManager.capture();
    const saved = JSON.parse(localStorage.getItem("savedViews") || "[]");
    saved.push({ name, bookmarkState: state.state, timestamp: new Date().toISOString() });
    localStorage.setItem("savedViews", JSON.stringify(saved));
    closeCaptureModal();
    alert("View saved.");
  } catch (err) {
    console.error("Capture failed:", err);
  }
}

function applyBookmark(state) {
  if (!report || !state) return;
  report.bookmarksManager.applyState(state)
    .then(() => console.log("Bookmark applied."))
    .catch(err => console.error("Apply failed:", err));
}

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
      <button onclick='applyBookmark(${JSON.stringify(view.bookmarkState)})'>Apply</button>
      <button onclick='deleteView(${i})'>Delete</button><br><br>
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

function copyShareLink() {
  const name = document.getElementById("viewNameInput").value.trim();
  const link = `${window.location.href}#${encodeURIComponent(name)}`;
  navigator.clipboard.writeText(link).then(() => alert("Link copied to clipboard."));
}
