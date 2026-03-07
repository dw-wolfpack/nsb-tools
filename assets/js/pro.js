/**
 * NSB Tools - Pro UX (local gating, upgrade modal). No Stripe or worker yet.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "nsb_pro";
  var STORAGE_EMAIL_KEY = "nsb_pro_email";

  function isPro() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function setPro(enabled, email) {
    try {
      if (enabled) {
        localStorage.setItem(STORAGE_KEY, "true");
        if (email != null && String(email).trim()) {
          localStorage.setItem(STORAGE_EMAIL_KEY, String(email).trim());
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EMAIL_KEY);
      }
    } catch (e) {}
  }

  function isDebug() {
    try {
      return typeof window !== "undefined" && window.location && window.location.search && window.location.search.indexOf("debug=1") !== -1;
    } catch (e) {
      return false;
    }
  }

  function openUpgradeModal() {
    var modal = typeof window.NSB_MODAL !== "undefined" ? window.NSB_MODAL : null;
    var toast = typeof window.NSB_TOAST !== "undefined" && window.NSB_TOAST && typeof window.NSB_TOAST.show === "function" ? window.NSB_TOAST : null;
    if (!modal || typeof modal.open !== "function") return;

    var disableLinkHtml = isDebug()
      ? '<p class="small muted" style="margin-top:1rem;"><a href="#" id="nsb-pro-disable-link" class="modal-pro-disable">Disable Pro</a></p>'
      : "";

    var content =
      '<h2 id="nsb-modal-title">NSB Tools Pro</h2>' +
      "<ul class=\"modal-pro-list\">" +
      "<li>Save presets (coming soon)</li>" +
      "<li>Compare scenarios (coming soon)</li>" +
      "<li>Export results</li>" +
      "<li>No limits (coming soon)</li>" +
      "</ul>" +
      "<div class=\"modal-actions\">" +
      "<button type=\"button\" class=\"btn btn-primary\" id=\"nsb-pro-upgrade-btn\">Upgrade</button>" +
      "<button type=\"button\" class=\"btn btn-secondary\" data-nsb-modal-close>Close</button>" +
      "</div>" +
      "<div class=\"modal-pro-already-row\">" +
      "<button type=\"button\" class=\"btn btn-secondary btn-sm\" id=\"nsb-pro-already-paid\">I already paid</button>" +
      "</div>" +
      "<div id=\"nsb-pro-unlock\" class=\"modal-pro-unlock\" hidden>" +
      "<label for=\"nsb-pro-email\">Email</label>" +
      "<input type=\"email\" id=\"nsb-pro-email\" class=\"input\" placeholder=\"you@example.com\" maxlength=\"254\">" +
      "<p id=\"nsb-pro-email-error\" class=\"modal-pro-error\" hidden></p>" +
      "<button type=\"button\" class=\"btn btn-primary\" id=\"nsb-pro-unlock-btn\">Unlock Pro</button>" +
      "<p class=\"small muted\">Real license check ships next.</p>" +
      "</div>" +
      disableLinkHtml;

    modal.open(content);

    var overlay = document.getElementById("nsb-modal-overlay");
    if (!overlay) return;

    function closeModal() {
      if (modal && typeof modal.close === "function") modal.close();
    }

    function showToast(msg) {
      if (toast) toast.show(msg);
    }

    var upgradeBtn = overlay.querySelector("#nsb-pro-upgrade-btn");
    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", function () {
        showToast("Checkout coming next");
      });
    }

    var alreadyPaidBtn = overlay.querySelector("#nsb-pro-already-paid");
    var unlockBlock = overlay.querySelector("#nsb-pro-unlock");
    if (alreadyPaidBtn && unlockBlock) {
      alreadyPaidBtn.addEventListener("click", function () {
        unlockBlock.hidden = !unlockBlock.hidden;
        var errEl = overlay.querySelector("#nsb-pro-email-error");
        if (errEl) errEl.hidden = true;
        if (!unlockBlock.hidden) {
          var emailInputEl = overlay.querySelector("#nsb-pro-email");
          if (emailInputEl && emailInputEl.focus) emailInputEl.focus();
        }
      });
    }

    var unlockBtn = overlay.querySelector("#nsb-pro-unlock-btn");
    var emailInput = overlay.querySelector("#nsb-pro-email");
    var emailError = overlay.querySelector("#nsb-pro-email-error");
    if (unlockBtn && emailInput && emailError) {
      unlockBtn.addEventListener("click", function () {
        var email = (emailInput.value || "").trim();
        if (!email || email.indexOf("@") < 1 || email.length > 254) {
          emailError.textContent = "Enter a valid email.";
          emailError.hidden = false;
          return;
        }
        setPro(true, email);
        showToast("Pro unlocked");
        closeModal();
        if (typeof window.NSB_HEADER !== "undefined" && window.NSB_HEADER.render) {
          window.NSB_HEADER.render();
        }
      });
    }

    var disableLink = overlay.querySelector("#nsb-pro-disable-link");
    if (disableLink) {
      disableLink.addEventListener("click", function (e) {
        e.preventDefault();
        setPro(false);
        closeModal();
        if (typeof window.NSB_HEADER !== "undefined" && window.NSB_HEADER.render) {
          window.NSB_HEADER.render();
        }
      });
    }
  }

  function requirePro(onAllowed) {
    if (isPro() && typeof onAllowed === "function") {
      onAllowed();
    } else {
      openUpgradeModal();
    }
  }

  window.NSB_PRO = {
    isPro: isPro,
    setPro: setPro,
    openUpgradeModal: openUpgradeModal,
    requirePro: requirePro
  };

  if (typeof window.NSB_OPEN_UPGRADE !== "undefined") {
    window.NSB_OPEN_UPGRADE = function () { openUpgradeModal(); };
  }
})();
