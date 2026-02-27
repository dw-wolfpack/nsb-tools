/**
 * NSB Tools - Footer component
 */

(function () {
  "use strict";

  function getBasePath() {
    return window.location.origin + "/";
  }

  window.NSB_FOOTER = {
    render(container) {
      const base = getBasePath();
      const html = `
        <footer class="footer layout">
          <div class="footer-links">
            <a href="${base}about/">About</a>
            <a href="${base}faq/">FAQ</a>
            <a href="${base}updates/">Updates</a>
            <a href="${base}changelog/">Changelog</a>
            <a href="${base}glossary/">Glossary</a>
            <a href="${base}privacy/">Privacy</a>
            <a href="${base}terms/">Terms</a>
          </div>
          <p style="margin-top: 0.5rem; margin-bottom: 0;">NSB Tools. Fast, client-side tools. No tracking.</p>
        </footer>
      `;

      if (typeof container === "string") {
        const el = document.querySelector(container);
        if (el) el.innerHTML = html;
      } else if (container && container.innerHTML !== undefined) {
        container.innerHTML = html;
      } else {
        const wrap = document.getElementById("nsb-footer");
        if (wrap) wrap.innerHTML = html;
      }
    }
  };
})();
