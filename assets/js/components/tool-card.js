/**
 * NSB Tools - Tool card component
 */

(function () {
  "use strict";

  function getBasePath() {
    return window.location.origin + "/";
  }

  function escapeHtml(s) {
    if (s == null || s === "") return "";
    const str = String(s);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  window.NSB_TOOL_CARD = {
    render(tool, options) {
      const base = getBasePath();
      const path = escapeHtml(tool.path || base + "tools/" + (tool.slug || "") + "/");
      const tags = (tool.tags || []).slice(0, 3).map((t) =>
        `<span class="tool-card-tag">${escapeHtml(t)}</span>`
      ).join("");
      const name = escapeHtml(tool.name || "");
      const desc = escapeHtml(tool.description || "");
      const slug = escapeHtml(tool.slug || "");
      return `
        <div class="tool-card-wrapper">
          <a href="${path}" class="tool-card" data-tool-slug="${slug}">
            <h3 class="tool-card-title">${name}</h3>
            <p class="tool-card-desc">${desc}</p>
            ${tags ? `<div class="tool-card-tags">${tags}</div>` : ""}
            <span class="tool-card-cta">Open &rarr;</span>
          </a>
        </div>
      `;
    },

    renderAll(tools, container) {
      const base = getBasePath();
      if (!container) return "";
      const html = tools.map((t) => this.render(t)).join("");
      if (typeof container === "string") {
        const el = document.querySelector(container);
        if (el) el.innerHTML = html;
      } else if (container && container.innerHTML !== undefined) {
        container.innerHTML = html;
      }
    }
  };
})();
