/**
 * NSB Tools - Main bootstrap
 */

(function () {
  "use strict";

  const DAILY_LIMIT = 20;

  window.nsbAnalytics = {
    track(eventName, props) {
      if (typeof console !== "undefined" && console.debug) {
        console.debug("[nsbAnalytics]", eventName, props);
      }
    }
  };

  function getBasePath() {
    const origin = window.location.origin;
    return origin + "/";
  }

  function checkPro() {
    try {
      return localStorage.getItem("nsb_pro") === "true";
    } catch {
      return false;
    }
  }

  function getTodayKey() {
    const d = new Date();
    return "nsb_gens_" + d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function getTodayCount() {
    try {
      const v = localStorage.getItem(getTodayKey());
      return parseInt(v || "0", 10);
    } catch {
      return 0;
    }
  }

  function incrementTodayCount() {
    try {
      const key = getTodayKey();
      const n = getTodayCount() + 1;
      localStorage.setItem(key, String(n));
      return n;
    } catch {
      return 0;
    }
  }

  function canGenerate(consumesCredit) {
    if (!consumesCredit) return true;
    if (checkPro()) return true;
    return getTodayCount() < DAILY_LIMIT;
  }

  function showUpgradeModal() {
    const base = getBasePath();
    const content = `
      <h2 id="nsb-modal-title">Pro is coming soon</h2>
      <p>Pro will remove daily limits and unlock batch exports and presets. <a href="${base}updates/">Get updates</a> for first access.</p>
      <div class="modal-actions">
        <a href="${base}updates/" class="btn btn-primary">Get updates</a>
        <button type="button" class="btn btn-secondary" data-nsb-modal-close>Close</button>
      </div>
    `;
    if (typeof window.NSB_MODAL !== "undefined") {
      window.NSB_MODAL.open(content);
    }
    window.nsbAnalytics.track("upgrade_click", { source: "limit" });
  }

  window.NSB_OPEN_UPGRADE = showUpgradeModal;
  window.NSB_CHECK_PRO = checkPro;
  window.NSB_CAN_GENERATE = canGenerate;
  window.NSB_INCREMENT_GEN = incrementTodayCount;
  window.NSB_GET_BASE = getBasePath;

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    const headerEl = document.getElementById("nsb-header");
    const footerEl = document.getElementById("nsb-footer");

    if (headerEl && typeof window.NSB_HEADER !== "undefined") {
      window.NSB_HEADER.render(headerEl);
    }
    if (footerEl && typeof window.NSB_FOOTER !== "undefined") {
      window.NSB_FOOTER.render(footerEl);
    }

    const searchInput = document.getElementById("nsb-search");
    if (searchInput && window.NSB_SEARCH_QUERY) {
      searchInput.value = window.NSB_SEARCH_QUERY;
    }
  }

  init();
})();
