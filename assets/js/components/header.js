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
    if (path.startsWith("/ai")) return "ai";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/faq")) return "faq";
    if (path.startsWith("/updates")) return "updates";
    if (path.startsWith("/changelog")) return "changelog";
    if (path.startsWith("/glossary")) return "glossary";
    return "";
  }

  function isProUser() {
    try {
      return localStorage.getItem("nsb_pro") === "true";
    } catch (e) {}
    return false;
  }

  function isDebug() {
    return (typeof window !== "undefined" && window.location && window.location.search) ?
      window.location.search.includes("debug=1") : false;
  }

  function isDebugOrPro() {
    if (isProUser()) return true;
    return isDebug();
  }

  function getProNavHtml(pro, showProBtn) {
    return pro ? '<button type="button" class="pro-badge" id="nsb-pro-badge">Pro</button>' : (showProBtn ? '<button type="button" class="btn btn-secondary btn-sm" data-nsb-open-upgrade>Upgrade</button>' : "");
  }

  function bindOnce(el, key, event, handler) {
    if (!el || typeof el.addEventListener !== "function") return;
    var attr = "data-nsb-bound-" + key;
    if (el.getAttribute && el.getAttribute(attr) === "true") return;
    if (el.setAttribute) el.setAttribute(attr, "true");
    el.addEventListener(event, handler);
  }

  function finishRender(container) {
    const base = getBasePath();
    const active = getActiveFromPath();
    const q = (typeof window.NSB_SEARCH_QUERY === "string") ? window.NSB_SEARCH_QUERY : "";

    const pro = isProUser();
    const showProBtn = !pro;
    const proNav = getProNavHtml(pro, showProBtn);
    const html = `
        <div class="header layout">
          <div class="header-inner">
            <a href="${base}" class="header-logo">NSB Tools</a>
            <nav class="header-nav" aria-label="Main navigation">
              <a href="${base}"${active === "home" ? " class=\"active\"" : ""}>Home</a>
              <a href="${base}categories/"${active === "categories" ? " class=\"active\"" : ""}>Categories</a>
              <a href="${base}ai/"${active === "ai" ? " class=\"active\"" : ""}>AI</a>
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
    if (searchInput && window.NSB_UTILS && window.NSB_UTILS.debounce) {
      bindOnce(searchInput, "search-input", "input", window.NSB_UTILS.debounce(() => {
        window.NSB_SEARCH_QUERY = searchInput.value.trim();
        if (typeof window.NSB_ON_SEARCH === "function") {
          window.NSB_ON_SEARCH(window.NSB_SEARCH_QUERY);
        }
      }, 300));
    }
    if (searchInput) {
      bindOnce(searchInput, "search-enter", "keydown", function (e) {
        if (e.key === "Enter") {
          const path = window.location.pathname || "";
          const isHome = path === "/" || path === "/index.html" || path === "";
          if (!isHome) {
            const q = (searchInput.value || "").trim();
            const base = getBasePath();
            const url = base + (q ? "?q=" + encodeURIComponent(q) : "");
            window.location.href = url;
            e.preventDefault();
          }
        }
      });
    }
    if (searchInput && typeof window.NSB_SEARCH_SUGGEST !== "undefined" && window.NSB_SEARCH_SUGGEST.init) {
      window.NSB_SEARCH_SUGGEST.init(searchInput, { maxResults: 8 });
    }

    const upgradeBtn = document.querySelector("[data-nsb-open-upgrade]");
    if (upgradeBtn) {
      bindOnce(upgradeBtn, "upgrade", "click", function (e) {
        if (upgradeBtn.tagName === "A") e.preventDefault();
        if (typeof window.NSB_OPEN_UPGRADE === "function") window.NSB_OPEN_UPGRADE();
      });
    }

    const proBadge = document.getElementById("nsb-pro-badge");
    if (proBadge) {
      bindOnce(proBadge, "pro-badge", "click", function () {
        if (typeof window.NSB_OPEN_UPGRADE === "function") window.NSB_OPEN_UPGRADE();
      });
    }
  }

  window.NSB_HEADER = {
    getProNavHtml: getProNavHtml,
    render(container) {
      if (window.NSB_CONFIG) {
        finishRender(container);
        return;
      }
      var existing = document.querySelector('script[src="/assets/js/config.js"]');
      if (existing) {
        var attempts = 0;
        var maxAttempts = 50;
        var done = function () {
          if (window.NSB_CONFIG || attempts >= maxAttempts) {
            finishRender(container);
          } else {
            attempts++;
            setTimeout(done, 20);
          }
        };
        done();
        return;
      }
      var script = document.createElement("script");
      script.type = "module";
      script.src = "/assets/js/config.js";
      script.onload = function () {
        finishRender(container);
      };
      document.head.appendChild(script);
    }
  };
})();
