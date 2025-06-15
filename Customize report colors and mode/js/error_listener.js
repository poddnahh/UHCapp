// js/error_listener.js
window.addEventListener("error", function(event) {
  try {
    if (window.parent.playground?.logShowcaseError) {
      window.parent.playground.logShowcaseError("CustomizeColors", event);
    }
  } catch {}
});
