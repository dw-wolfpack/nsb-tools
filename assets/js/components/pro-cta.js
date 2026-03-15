/**
 * NSB Tools - Pro CTA bottom strip on tool/ai pages.
 * API: window.NSB_PRO_CTA.mountBottomStrip()
 */
(function () {
  "use strict";

  var STRIP_ID = "nsb-pro-cta-strip";

  function isPro() {
    try {
      return localStorage.getItem("nsb_pro") === "true";
    } catch (e) {}
    return false;
  }

  function openUpgrade() {
    if (typeof window.NSB_OPEN_UPGRADE === "function") window.NSB_OPEN_UPGRADE();
  }

  function shouldMount() {
    if (isPro()) return false;
    var path = (window.location && window.location.pathname) || "";
    return path.indexOf("/tools/") === 0 || path.indexOf("/ai/") === 0;
  }

  function getToolHint() {
    var path = (window.location && window.location.pathname) || "";
    if (/\/tools\/(loan-debt|burn-rate|break-even|freelance-rate|salary-vs-freelance|project-pricing|employee-vs-contractor|saas-roi|sba-payment)/.test(path)) return "calculator";
    return undefined;
  }

  function mountBottomStrip() {
    if (!shouldMount()) return;
    var main = document.querySelector("main");
    if (!main) return;
    if (document.getElementById(STRIP_ID)) return;

    var copy = (window.NSB_PRO_COPY && typeof window.NSB_PRO_COPY.bottomStripText === "function")
      ? window.NSB_PRO_COPY.bottomStripText(getToolHint())
      : { headline: "Save your inputs and export to CSV.", subtext: "NSB Tools Pro. $14.99/mo." };
    var headline = (copy && copy.headline) ? String(copy.headline).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "Save your inputs and export to CSV.";
    var subtext = (copy && copy.subtext) ? String(copy.subtext).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "NSB Tools Pro. $14.99/mo.";

    var strip = document.createElement("div");
    strip.id = STRIP_ID;
    strip.className = "nsb-pro-cta-strip";
    strip.setAttribute("role", "complementary");
    strip.setAttribute("aria-label", "Upgrade to Pro");
    strip.innerHTML =
      '<p class="nsb-pro-cta-headline">' + headline + "</p>" +
      '<p class="small muted nsb-pro-cta-meta">' + subtext + "</p>" +
      '<div class="nsb-pro-cta-strip-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" id="nsb-pro-cta-upgrade">Upgrade</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" id="nsb-pro-cta-login">Log in</button>' +
      "</div>";

    main.appendChild(strip);

    var upgradeBtn = document.getElementById("nsb-pro-cta-upgrade");
    var loginBtn = document.getElementById("nsb-pro-cta-login");
    if (upgradeBtn) upgradeBtn.addEventListener("click", openUpgrade);
    if (loginBtn) loginBtn.addEventListener("click", openUpgrade);
  }

  function removeStrip() {
    var el = document.getElementById(STRIP_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function onProChanged() {
    removeStrip();
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("nsb:pro-changed", onProChanged);
  }

  window.NSB_PRO_CTA = {
    mountBottomStrip: mountBottomStrip,
    removeStrip: removeStrip,
  };
})();
