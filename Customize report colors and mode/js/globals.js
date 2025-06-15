// js/globals.js

// 1) Hard-coded embed token:
window.reportConfig = {
  accessToken: "<YOUR_TOKEN>",
  embedUrl:    null,
  reportId:    null
};

// 2) Fetch the list just to get the URL/ID
;(function loadReportConfig() {
  fetch("./reportList.json")
    .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
    .then(list => {
      const params = new URLSearchParams(location.search);
      const name   = params.get("report");
      const entry  = name
        ? list.find(r => r.name === name)
        : list[0];

      if (!entry) throw new Error("No matching report in list");
      window.reportConfig.embedUrl = entry.embedUrl;
      window.reportConfig.reportId = new URL(entry.embedUrl)
                                       .searchParams
                                       .get("reportId");
    })
    .catch(e => {
      document.getElementById("overlay").innerHTML = `
        <div style="color:red;padding:20px;">
          Failed to load reportList.json:<br>${e}
        </div>`;
    });
})();
