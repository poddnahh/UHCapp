// js/error_listener.js
// ----------------------------------------------------------------------------
window.addEventListener("error", e => {
  console.error("Unhandled error:", e.error || e);
});

