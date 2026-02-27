/**
 * NSB Tools - Tool page sections component
 * Renders What it does, How to use, Examples, FAQ, Related tools from TOOL_PAGE_CONTENT.
 * Call NSB_TOOL_PAGE_SECTIONS.render(slug) after DOMContentLoaded.
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.NSB_TOOL_PAGE_SECTIONS = {
    render(slug) {
      const R = window.NSB_REGISTRY;
      if (!R || !slug) return "";

      const tool = R.getToolBySlug(slug);
      const content = R.TOOL_PAGE_CONTENT && R.TOOL_PAGE_CONTENT[slug];
      if (!tool || !content) return "";

      const category = R.getCategoryBySlug(tool.category);
      const categoryName = category ? category.name : tool.category;
      const categoryPath = "/categories/" + tool.category + "/";

      const relatedSlugs = content.relatedSlugs || R.getRelatedTools(slug, 6).map(t => t.slug);
      const relatedTools = relatedSlugs
        .map(s => R.getToolBySlug(s))
        .filter(Boolean)
        .slice(0, 6);

      let html = "";

      html += '<section class="section"><h2>What it does</h2><p>' + escapeHtml(content.whatItDoes) + "</p></section>";

      if (content.howToUse && content.howToUse.length) {
        html += '<section class="section"><h2>How to use</h2><ul>';
        content.howToUse.forEach(function (step) {
          html += "<li>" + escapeHtml(step) + "</li>";
        });
        html += "</ul></section>";
      }

      if (content.examples && content.examples.length) {
        html += '<section class="section"><h2>Examples</h2>';
        content.examples.forEach(function (ex) {
          html += "<p>" + escapeHtml(ex) + "</p>";
        });
        html += "</section>";
      }

      if (content.faq && content.faq.length) {
        html += '<section class="section"><h2>FAQ</h2>';
        content.faq.forEach(function (item) {
          html += '<h3>' + escapeHtml(item.q) + "</h3><p>" + escapeHtml(item.a) + "</p>";
        });
        html += "</section>";
      }

      if (content.collectionPath) {
        html += '<section class="section"><p>Part of the <a href="' + escapeHtml(content.collectionPath) + '">Business Toolkit</a>.</p></section>';
      }

      if (relatedTools.length) {
        html += '<section class="section"><h2>Related tools</h2><p>';
        html += relatedTools.map(function (t) {
          return '<a href="' + escapeHtml(t.path) + '">' + escapeHtml(t.name) + "</a>";
        }).join(", ");
        html += "</p></section>";
      }

      return html;
    },

    inject(containerId, slug) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = this.render(slug);
    }
  };
})();
