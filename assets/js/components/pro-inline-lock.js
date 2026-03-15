/**
 * NSB Tools - Pro inline lock banner (moment-of-want) below locked buttons.
 * API: window.NSB_PRO_INLINE_LOCK.show(anchorEl, opts)
 */
(function () {
  "use strict";

  var ANCHOR_ATTR = "data-nsb-inline-lock-shown";
  var BANNER_CLASS = "nsb-pro-inline-lock";

  function isPro() {
    try {
      return localStorage.getItem("nsb_pro") === "true";
    } catch (e) {}
    return false;
  }

  function openUpgrade() {
    if (typeof window.NSB_OPEN_UPGRADE === "function") window.NSB_OPEN_UPGRADE();
  }

  function show(anchorEl) {
    if (!anchorEl || typeof anchorEl.getAttribute !== "function") return;
    if (isPro()) return;
    if (anchorEl.getAttribute(ANCHOR_ATTR) === "true") return;

    var context = (anchorEl.getAttribute && anchorEl.getAttribute("data-nsb-lock-context")) || "";
    var copy = (window.NSB_PRO_COPY && typeof window.NSB_PRO_COPY.inlineLockText === "function")
      ? window.NSB_PRO_COPY.inlineLockText(context)
      : "Unlock Pro to continue.";
    var price = (window.NSB_PRO_COPY && typeof window.NSB_PRO_COPY.formatPrice === "function")
      ? window.NSB_PRO_COPY.formatPrice()
      : "$14.99/mo";
    var text = String(copy).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var priceSafe = String(price).replace(/</g, "&lt;").replace(/>/g, "&gt;");

    var banner = document.createElement("div");
    banner.className = BANNER_CLASS;
    banner.setAttribute("role", "status");
    banner.innerHTML =
      '<p>' + text + '</p>' +
      '<p class="small muted nsb-pro-inline-price">' + priceSafe + '</p>' +
      '<div class="nsb-pro-inline-actions">' +
      '<button type="button" class="btn btn-primary btn-sm" data-nsb-inline-upgrade>Upgrade</button>' +
      '<button type="button" class="btn btn-secondary btn-sm" data-nsb-inline-login>Log in</button>' +
      "</div>";

    var parent = anchorEl.parentNode;
    if (!parent) return;
    var next = anchorEl.nextSibling;
    parent.insertBefore(banner, next);
    anchorEl.setAttribute(ANCHOR_ATTR, "true");

    banner.querySelectorAll("[data-nsb-inline-upgrade], [data-nsb-inline-login]").forEach(function (btn) {
      btn.addEventListener("click", openUpgrade);
    });
  }

  function hideAll() {
    document.querySelectorAll("." + BANNER_CLASS).forEach(function (el) {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    document.querySelectorAll("[" + ANCHOR_ATTR + "=\"true\"]").forEach(function (el) {
      el.removeAttribute(ANCHOR_ATTR);
    });
  }

  function onProChanged() {
    hideAll();
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("nsb:pro-changed", onProChanged);
  }

  window.NSB_PRO_INLINE_LOCK = {
    show: show,
    hideAll: hideAll,
  };
})();
