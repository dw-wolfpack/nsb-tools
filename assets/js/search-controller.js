/**
 * NSB Tools - Shared search controller
 * Syncs hero and header search inputs, clears chip filters when searching, calls NSB_ON_SEARCH.
 */
(function () {
  "use strict";

  function debounce(fn, ms) {
    if (typeof window.NSB_UTILS !== "undefined" && typeof window.NSB_UTILS.debounce === "function") {
      return window.NSB_UTILS.debounce(fn, ms);
    }
    var id;
    return function () {
      clearTimeout(id);
      id = setTimeout(fn, ms);
    };
  }

  function waitForEl(selector, maxMs, callback) {
    var start = Date.now();
    function check() {
      var el = document.querySelector ? document.querySelector(selector) : null;
      if (el) {
        if (callback) callback(el);
        return;
      }
      if (Date.now() - start < maxMs) {
        setTimeout(check, 50);
      } else if (callback) {
        callback(null);
      }
    }
    check();
  }

  function resetChipsToAll() {
    var chipRow = document.querySelector && document.querySelector(".chip-row");
    if (!chipRow) return;
    var chips = chipRow.querySelectorAll && chipRow.querySelectorAll(".chip");
    if (!chips || chips.length === 0) return;
    for (var i = 0; i < chips.length; i++) {
      chips[i].setAttribute("aria-pressed", "false");
    }
    var allChip = chipRow.querySelector && chipRow.querySelector(".chip[data-category='']");
    if (allChip) allChip.setAttribute("aria-pressed", "true");
  }

  function syncInputs(next) {
    var hero = document.getElementById && document.getElementById("nsb-hero-search");
    var header = document.getElementById && document.getElementById("nsb-search");
    if (hero && hero.value !== next) hero.value = next;
    if (header && header.value !== next) header.value = next;
  }

  function setQuery(next, source) {
    var trimmed = (next == null ? "" : String(next)).trim();
    window.NSB_SEARCH_QUERY = trimmed;

    if (trimmed.length > 0) {
      window.NSB_CATEGORY_FILTER = "";
      window.NSB_TAG_FILTER = "";
      resetChipsToAll();
    }

    syncInputs(trimmed);

    if (typeof window.NSB_ON_SEARCH === "function") {
      window.NSB_ON_SEARCH();
    }
  }

  function bindHomeHeroSearch() {
    var heroSearch = document.getElementById && document.getElementById("nsb-hero-search");
    if (!heroSearch) return;
    var handler = debounce(function () {
      setQuery(heroSearch.value, "hero");
    }, 300);
    heroSearch.addEventListener("input", handler);
  }

  function bindHeaderSearch() {
    waitForEl("#nsb-search", 1500, function (el) {
      if (!el) return;
      var handler = debounce(function () {
        setQuery(el.value, "header");
      }, 300);
      el.addEventListener("input", handler);
    });
  }

  window.NSB_SEARCH = {
    setQuery: setQuery,
    resetChipsToAll: resetChipsToAll,
    syncInputs: syncInputs,
    bindHomeHeroSearch: bindHomeHeroSearch,
    bindHeaderSearch: bindHeaderSearch
  };
})();
