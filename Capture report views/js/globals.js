// Minimal globals for capture report views sample

let reportConfig = {
  accessToken: null,
  embedUrl: undefined,
  reportId: undefined,
  type: 'report'
};

let bookmarkShowcaseState = {
  report: null
};

const overlay = $('#overlay');
const reportContainer = $('#report-container').get(0);
const bookmarkContainer = $('#bookmark-container').get(0);

const regex = new RegExp('[?&]id(=([^&#]*)|&|#|$)');
