/**
 * NSB Tools - Related AI guides renderer for calculator pages
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function inject(containerId, toolSlug) {
    var el = document.getElementById(containerId);
    if (!el) return;
    var data = window.NSB_RELATED_GUIDES;
    if (!data || !data.byToolSlug) return;
    var guides = data.byToolSlug[toolSlug];
    if (!guides || !guides.length) return;
    var links = guides.map(function (g) {
      return '<li><a href="' + esc(g.href) + '">' + esc(g.title) + "</a></li>";
    }).join("");
    el.innerHTML =
      '<div class="card related-guides-card">' +
        "<h3>Related AI guides</h3>" +
        "<ul>" + links + "</ul>" +
      "</div>";
  }

  window.NSB_RELATED_GUIDES_UI = { inject: inject };
})();
