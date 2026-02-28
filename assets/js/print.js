/**
 * NSB Tools - Print mode
 * If ?print=1 is in the URL, add "print-mode" class to <html>
 * and optionally auto-print if ?autoprt=1 is also present.
 */
(function () {
  "use strict";

  function init() {
    var params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch (e) {
      return;
    }
    if (params.get("print") !== "1") return;
    document.documentElement.classList.add("print-mode");
    document.title = document.title + " (Printable)";
    if (params.get("autoprt") === "1") {
      window.print();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
