/**
 * NSB Tools - Search typeahead dropdown
 * Renders matching tools under the header search input; keyboard and click navigate.
 */

(function () {
  "use strict";

  var BLUR_HIDE_DELAY_MS = 150;
  var POLL_REGISTRY_MS = 50;
  var POLL_REGISTRY_MAX = 100;

  function getTools(R) {
    if (!R || !R.TOOLS) return [];
    var showHidden = (typeof window !== "undefined" && window.NSB_DEBUG_HIDDEN);
    return R.TOOLS.filter(function (t) { return showHidden || !t.isHidden; });
  }

  function matchTool(tool, q) {
    var lower = (q || "").trim().toLowerCase();
    if (!lower) return false;
    var name = (tool.name || "").toLowerCase();
    var desc = (tool.description || "").toLowerCase();
    var tags = (tool.tags || []).join(" ").toLowerCase();
    return name.indexOf(lower) >= 0 || desc.indexOf(lower) >= 0 || tags.indexOf(lower) >= 0;
  }

  function filterTools(R, query, maxResults) {
    var list = getTools(R);
    var q = (query || "").trim();
    if (!q) return [];
    return list.filter(function (t) { return matchTool(t, q); }).slice(0, maxResults || 8);
  }

  function esc(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function ensureRegistry(cb) {
    if (window.NSB_REGISTRY && window.NSB_REGISTRY.TOOLS) {
      cb(window.NSB_REGISTRY);
      return;
    }
    var attempts = 0;
    function poll() {
      if (window.NSB_REGISTRY && window.NSB_REGISTRY.TOOLS) {
        cb(window.NSB_REGISTRY);
        return;
      }
      attempts++;
      if (attempts < POLL_REGISTRY_MAX) setTimeout(poll, POLL_REGISTRY_MS);
      else cb(null);
    }
    poll();
  }

  function init(inputEl, opts) {
    if (!inputEl || typeof inputEl.addEventListener !== "function") return;
    opts = opts || {};
    var maxResults = typeof opts.maxResults === "number" ? opts.maxResults : 8;

    var wrapper = inputEl.closest && inputEl.closest(".header-search");
    if (!wrapper) wrapper = inputEl.parentNode;
    if (!wrapper) return;
    if (wrapper.getAttribute && wrapper.getAttribute("data-nsb-suggest-bound") === "true") return;
    if (wrapper.setAttribute) wrapper.setAttribute("data-nsb-suggest-bound", "true");

    var dropdown = document.createElement("div");
    dropdown.className = "search-suggest";
    dropdown.setAttribute("role", "listbox");
    dropdown.setAttribute("aria-label", "Search results");
    dropdown.hidden = true;
    wrapper.appendChild(dropdown);

    var blurTimer = null;
    var activeIndex = -1;

    function hide() {
      dropdown.hidden = true;
      activeIndex = -1;
    }

    function getItems() {
      return dropdown.querySelectorAll(".search-suggest-item");
    }

    function show() {
      dropdown.hidden = false;
      activeIndex = -1;
      var items = getItems();
      if (items.length) {
        items[0].classList.add("is-active");
        activeIndex = 0;
      }
    }

    function setActive(i) {
      var items = getItems();
      items.forEach(function (el, idx) { el.classList.toggle("is-active", idx === i); });
      activeIndex = i;
      if (items[i] && items[i].scrollIntoView) items[i].scrollIntoView({ block: "nearest" });
    }

    function update() {
      var query = (inputEl.value || "").trim();
      if (!query.length) {
        hide();
        return;
      }
      ensureRegistry(function (R) {
        if (!R) {
          dropdown.innerHTML = '<div class="search-suggest-empty" role="status">Loading...</div>';
          show();
          return;
        }
        var tools = filterTools(R, query, maxResults);
        if (!tools.length) {
          dropdown.innerHTML = '<div class="search-suggest-empty" role="status">No tools match.</div>';
          show();
          return;
        }
        var html = tools.map(function (t) {
          var path = (t.path || "/tools/" + (t.slug || "") + "/").replace(/"/g, "&quot;");
          var meta = (t.description || "").slice(0, 60);
          if ((t.description || "").length > 60) meta += "...";
          return '<a href="' + path + '" class="search-suggest-item" role="option">' +
            '<span class="search-suggest-item-name">' + esc(t.name || t.slug) + '</span>' +
            (meta ? '<span class="search-suggest-item-meta">' + esc(meta) + '</span>' : '') + '</a>';
        }).join("");
        dropdown.innerHTML = html;
        show();
      });
    }

    var debounceFn = (window.NSB_UTILS && window.NSB_UTILS.debounce)
      ? window.NSB_UTILS.debounce
      : function (fn, ms) {
        var t;
        return function () {
          var a = arguments;
          clearTimeout(t);
          t = setTimeout(function () { fn.apply(null, a); }, ms);
        };
      };
    var updateDebounced = debounceFn(update, 120);

    inputEl.addEventListener("input", function () { updateDebounced(); });
    inputEl.addEventListener("focus", function () {
      var q = (inputEl.value || "").trim();
      if (q.length) updateDebounced();
    });
    inputEl.addEventListener("blur", function () {
      blurTimer = setTimeout(function () {
        hide();
        blurTimer = null;
      }, BLUR_HIDE_DELAY_MS);
    });

    dropdown.addEventListener("mousedown", function (e) {
      if (blurTimer) { clearTimeout(blurTimer); blurTimer = null; }
    });
    dropdown.addEventListener("click", function (e) {
      var link = e.target && e.target.closest && e.target.closest("a");
      if (link && link.getAttribute("href")) {
        hide();
        window.location.href = link.getAttribute("href");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (!dropdown || dropdown.hidden) return;
      if (e.key === "Escape") {
        hide();
        inputEl.focus();
        e.preventDefault();
        return;
      }
      var items = getItems();
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        setActive(Math.min(activeIndex + 1, items.length - 1));
        e.preventDefault();
        return;
      }
      if (e.key === "ArrowUp") {
        setActive(Math.max(activeIndex - 1, 0));
        e.preventDefault();
        return;
      }
      if (e.key === "Enter" && activeIndex >= 0 && items[activeIndex]) {
        var href = items[activeIndex].getAttribute("href");
        if (href) {
          hide();
          window.location.href = href;
          e.preventDefault();
        }
      }
    });
  }

  window.NSB_SEARCH_SUGGEST = { init: init };
})();
