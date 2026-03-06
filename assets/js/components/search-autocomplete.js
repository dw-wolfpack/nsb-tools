/**
 * NSB Tools - Search autocomplete dropdown
 * Shows matching tools (and optionally categories) under the search input; click navigates.
 */

(function () {
  "use strict";

  var MAX_TOOLS = 10;
  var MAX_CATEGORIES = 2;
  var BLUR_HIDE_DELAY_MS = 150;
  var INPUT_DEBOUNCE_MS = 100;

  function getSearchableText(R, t) {
    var parts = [
      t.name || "",
      t.description || "",
      (t.tags || []).join(" "),
      t.seoDescription || "",
      (t.keywords || []).join(" ")
    ];
    if (R.TOOL_PAGE_CONTENT && R.TOOL_PAGE_CONTENT[t.slug]) {
      var what = R.TOOL_PAGE_CONTENT[t.slug].whatItDoes;
      if (typeof what === "string") parts.push(what);
      else if (Array.isArray(what)) parts.push(what.join(" "));
    }
    return parts.join(" ").toLowerCase();
  }

  function filterToolsForAutocomplete(R, query) {
    if (!R || !R.TOOLS) return { tools: [], categories: [] };
    var list = R.TOOLS.filter(function (t) {
      return (typeof window !== "undefined" && window.NSB_DEBUG_HIDDEN) || !t.isHidden;
    });
    var searchQ = (query || "").trim();
    if (!searchQ) return { tools: [], categories: [] };

    var lower = searchQ.toLowerCase();
    var catMatch = /^category:(\w+)$/i.exec(lower);
    if (catMatch) {
      list = list.filter(function (t) { return t.category === catMatch[1]; });
    } else {
      var words = lower.split(/\s+/).filter(Boolean);
      list = list.filter(function (t) {
        var searchable = getSearchableText(R, t);
        for (var w = 0; w < words.length; w++) {
          if (searchable.indexOf(words[w]) < 0) return false;
        }
        return true;
      });
    }

    var categories = [];
    if (R.CATEGORIES && !catMatch) {
      R.CATEGORIES.forEach(function (c) {
        if (categories.length >= MAX_CATEGORIES) return;
        var nameMatch = (c.name || "").toLowerCase().indexOf(lower) >= 0;
        var slugMatch = (c.slug || "").toLowerCase().indexOf(lower) >= 0;
        if (nameMatch || slugMatch) {
          categories.push(c);
        }
      });
    }

    return {
      tools: list.slice(0, MAX_TOOLS),
      categories: categories.slice(0, MAX_CATEGORIES)
    };
  }

  function buildDropdownHtml(results, query) {
    var parts = [];
    if (results.categories && results.categories.length) {
      results.categories.forEach(function (c) {
        parts.push('<a href="/categories/' + (c.slug || "") + '/" class="nsb-search-dropdown-item nsb-search-dropdown-item--category">' +
          '<span class="nsb-search-dropdown-item-name">' + (c.name || c.slug) + '</span>' +
          '<span class="nsb-search-dropdown-item-meta">Category</span></a>');
      });
    }
    if (results.tools && results.tools.length) {
      results.tools.forEach(function (t) {
        parts.push('<a href="' + (t.path || "/tools/" + t.slug + "/") + '" class="nsb-search-dropdown-item">' +
          '<span class="nsb-search-dropdown-item-name">' + (t.name || t.slug) + '</span>' +
          '<span class="nsb-search-dropdown-item-meta">' + (t.category || "") + '</span></a>');
      });
    }
    if (query.trim() && !parts.length) {
      return '<div class="nsb-search-dropdown-empty" role="status">No tools match.</div>';
    }
    return parts.length ? parts.join("") : "";
  }

  function positionDropdown(input, dropdown) {
    var wrapper = dropdown.parentNode;
    if (!wrapper || !input.getBoundingClientRect) return;
    var rect = input.getBoundingClientRect();
    var wRect = wrapper.getBoundingClientRect();
    dropdown.style.width = rect.width + "px";
    dropdown.style.left = (rect.left - wRect.left) + "px";
    dropdown.style.top = (rect.bottom - wRect.top + 2) + "px";
  }

  function attach(inputEl, options) {
    if (!inputEl || !inputEl.getBoundingClientRect) return;
    options = options || {};
    var R = window.NSB_REGISTRY;
    var debounceFn = (window.NSB_UTILS && window.NSB_UTILS.debounce) ? window.NSB_UTILS.debounce : function (fn, ms) {
      var t;
      return function () {
        var a = arguments;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(null, a); }, ms);
      };
    };

    var wrapper = inputEl.closest(".header-search");
    if (!wrapper) {
      wrapper = inputEl.parentNode;
    }
    var wrapperPosition = window.getComputedStyle(wrapper).position;
    if (wrapperPosition === "static") {
      wrapper.style.position = "relative";
    }

    var dropdown = document.createElement("div");
    dropdown.className = "nsb-search-dropdown";
    dropdown.setAttribute("role", "listbox");
    dropdown.setAttribute("aria-label", "Search results");
    dropdown.hidden = true;
    wrapper.appendChild(dropdown);

    var blurTimer = null;

    function hide() {
      dropdown.hidden = true;
    }

    function show() {
      dropdown.hidden = false;
      positionDropdown(inputEl, dropdown);
    }

    function update() {
      var query = (inputEl.value || "").trim();
      if (!query.length) {
        hide();
        return;
      }
      if (!R) {
        dropdown.innerHTML = '<div class="nsb-search-dropdown-empty" role="status">Loading...</div>';
        show();
        return;
      }
      var results = filterToolsForAutocomplete(R, query);
      var html = buildDropdownHtml(results, query);
      dropdown.innerHTML = html;
      if (html) {
        show();
      } else {
        hide();
      }
    }

    var updateDebounced = debounceFn(update, INPUT_DEBOUNCE_MS);

    inputEl.addEventListener("input", function () {
      updateDebounced();
    });

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
      if (blurTimer) {
        clearTimeout(blurTimer);
        blurTimer = null;
      }
    });

    dropdown.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        hide();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dropdown.hidden) {
        hide();
        inputEl.focus();
      }
    });

    window.addEventListener("scroll", function () {
      if (!dropdown.hidden) positionDropdown(inputEl, dropdown);
    }, true);

    window.addEventListener("resize", function () {
      if (!dropdown.hidden) positionDropdown(inputEl, dropdown);
    });
  }

  window.NSB_SEARCH_AUTOCOMPLETE = {
    attach: attach
  };
})();
