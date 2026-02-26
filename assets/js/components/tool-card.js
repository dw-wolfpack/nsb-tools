/**
 * NSB Tools - Tool card component
 */

(function () {
  "use strict";

  function getBasePath() {
    return window.location.origin + "/";
  }

  window.NSB_TOOL_CARD = {
    render(tool, options) {
      const base = getBasePath();
      const path = tool.path || base + "tools/" + tool.slug + "/";
      const tags = (tool.tags || []).slice(0, 3).map((t) =>
        `<span class="tool-card-tag">${String(t).replace(/</g, "&lt;")}</span>`
      ).join("");
      return `
        <a href="${path}" class="tool-card" data-tool-slug="${(tool.slug || "").replace(/"/g, "&quot;")}">
          <h3 class="tool-card-title">${(tool.name || "").replace(/</g, "&lt;")}</h3>
          <p class="tool-card-desc">${(tool.description || "").replace(/</g, "&lt;")}</p>
          ${tags ? `<div class="tool-card-tags">${tags}</div>` : ""}
          <span class="tool-card-cta">Open &rarr;</span>
        </a>
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
