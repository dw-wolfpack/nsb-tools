/**
 * NSB Tools - Header component
 */

(function () {
  "use strict";

  function getBasePath() {
    const path = window.location.pathname;
    const origin = window.location.origin;
    const base = origin + "/";
    return base;
  }

  function getActiveFromPath() {
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path === "") return "home";
    if (path.startsWith("/categories/")) return "categories";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/faq")) return "faq";
    if (path.startsWith("/updates")) return "updates";
    if (path.startsWith("/changelog")) return "changelog";
    if (path.startsWith("/glossary")) return "glossary";
    return "";
  }

  function isDebugOrPro() {
    try {
      if (localStorage.getItem("nsb_pro") === "true") return true;
    } catch (e) {}
    return (typeof window !== "undefined" && window.location && window.location.search) ?
      window.location.search.includes("debug=1") : false;
  }

  window.NSB_HEADER = {
    render(container) {
      const base = getBasePath();
      const active = getActiveFromPath();
      const q = (typeof window.NSB_SEARCH_QUERY === "string") ? window.NSB_SEARCH_QUERY : "";

      const showProBtn = isDebugOrPro();
      const proNav = showProBtn ? `<button type="button" class="btn btn-pro" data-nsb-open-upgrade>Pro</button>` : "";
      const html = `
        <div class="header layout">
          <div class="header-inner">
            <a href="${base}" class="header-logo">NSB Tools</a>
            <nav class="header-nav" aria-label="Main navigation">
              <a href="${base}"${active === "home" ? " class=\"active\"" : ""}>Home</a>
              <a href="${base}categories/"${active === "categories" ? " class=\"active\"" : ""}>Categories</a>
              <a href="${base}about/">About</a>
              <a href="${base}faq/">FAQ</a>
              <a href="${base}updates/"${active === "updates" ? " class=\"active\"" : ""}>Updates</a>
              <a href="${base}changelog/"${active === "changelog" ? " class=\"active\"" : ""}>Changelog</a>
              <a href="${base}glossary/"${active === "glossary" ? " class=\"active\"" : ""}>Glossary</a>
              ${proNav}
            </nav>
            <div class="header-search" role="search">
              <label for="nsb-search" class="visually-hidden">Search tools</label>
              <input type="search" id="nsb-search" placeholder="Search tools..." value="${(q || "").replace(/"/g, "&quot;")}" aria-label="Search tools">
            </div>
          </div>
        </div>
      `;

      if (typeof container === "string") {
        const el = document.querySelector(container);
        if (el) el.innerHTML = html;
      } else if (container && container.innerHTML !== undefined) {
        container.innerHTML = html;
      } else {
        const wrap = document.getElementById("nsb-header");
        if (wrap) wrap.innerHTML = html;
      }

      const searchInput = document.getElementById("nsb-search");
      if (searchInput) {
        searchInput.addEventListener("input", window.NSB_UTILS.debounce(() => {
          window.NSB_SEARCH_QUERY = searchInput.value.trim();
          if (typeof window.NSB_ON_SEARCH === "function") {
            window.NSB_ON_SEARCH(window.NSB_SEARCH_QUERY);
          }
          const heroSearch = document.getElementById("nsb-hero-search");
          if (heroSearch && heroSearch.value !== searchInput.value) {
            heroSearch.value = searchInput.value;
          }
        }, 300));
      }

      const upgradeBtn = document.querySelector("[data-nsb-open-upgrade]");
      if (upgradeBtn) {
        upgradeBtn.addEventListener("click", function (e) {
          if (upgradeBtn.tagName === "A") e.preventDefault();
          if (typeof window.NSB_OPEN_UPGRADE === "function") window.NSB_OPEN_UPGRADE();
        });
      }
    }
  };
})();
