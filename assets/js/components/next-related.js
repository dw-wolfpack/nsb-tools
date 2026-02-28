/**
 * NSB Tools - Next up / Related navigation for AI Hub pages
 * Reads window.NSB_AI_NAV and renders into a container element.
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function init(containerId) {
    var el = document.getElementById(containerId || "nsb-next-related");
    if (!el) return;
    var nav = window.NSB_AI_NAV;
    if (!nav || !nav.nextByPath) return;
    var path = window.location.pathname;
    var entry = nav.nextByPath[path];
    if (!entry) return;

    var html = '<div class="next-related">';

    if (entry.next) {
      html +=
        '<div class="next-related-next">' +
          '<span class="next-related-label">Next up</span> ' +
          '<a href="' + esc(entry.next.href) + '">' + esc(entry.next.title) + " &rarr;</a>" +
        "</div>";
    }

    if (entry.related && entry.related.length) {
      html += '<div class="next-related-section"><span class="next-related-label">Related</span><ul class="next-related-links">';
      for (var i = 0; i < entry.related.length; i++) {
        html += '<li><a href="' + esc(entry.related[i].href) + '">' + esc(entry.related[i].title) + "</a></li>";
      }
      html += "</ul></div>";
    }

    html += "</div>";
    el.innerHTML = html;
  }

  window.NSB_NEXT_RELATED = { init: init };
})();
