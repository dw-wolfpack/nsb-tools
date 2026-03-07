/**
 * NSB Tools - Pro UX: upgrade modal, real license verification, checkout URL routing.
 */
(function () {
  "use strict";

  var LICENSE_PROD_FALLBACK = "https://nsb-tools-license.cnfiegel.workers.dev";
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
          localStorage.setItem(STORAGE_EMAIL_KEY, String(email).trim().toLowerCase());
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_EMAIL_KEY);
      }
    } catch (e) {}
  }

  function getLicenseBase() {
    return (window.NSB_CONFIG && window.NSB_CONFIG.LICENSE_API_BASE) || LICENSE_PROD_FALLBACK;
  }

  function isDebug() {
    try {
      return typeof window !== "undefined" && window.location && window.location.search && window.location.search.indexOf("debug=1") !== -1;
    } catch (e) {
      return false;
    }
  }

  /**
   * Verify an email against the license worker.
   * Returns a promise resolving to true (active) or false (not active / error).
   */
  function verifyEmail(email) {
    var base = getLicenseBase();
    return fetch(base + "/verify?email=" + encodeURIComponent(email.toLowerCase()))
      .then(function (r) { return r.json(); })
      .then(function (data) { return !!(data && data.ok && data.active); })
      .catch(function () { return null; }); // null = network error
  }

  function openUpgradeModal() {
    var modal = typeof window.NSB_MODAL !== "undefined" ? window.NSB_MODAL : null;
    var toast = typeof window.NSB_TOAST !== "undefined" && window.NSB_TOAST && typeof window.NSB_TOAST.show === "function" ? window.NSB_TOAST : null;
    if (!modal || typeof modal.open !== "function") return;

    var pro = isPro();
    var logOutHtml = pro
      ? '<p class="small muted" style="margin-top:.5rem;"><button type="button" class="btn-link" id="nsb-pro-logout">Log out</button></p>'
      : "";

    var disableLinkHtml = isDebug()
      ? '<p class="small muted" style="margin-top:1rem;"><a href="#" id="nsb-pro-disable-link" class="modal-pro-disable">Disable Pro</a></p>'
      : "";

    var content =
      '<h2 id="nsb-modal-title">NSB Tools Pro</h2>' +
      '<ul class="modal-pro-list">' +
      "<li>Save presets (coming soon)</li>" +
      "<li>Compare scenarios (coming soon)</li>" +
      "<li>Export results</li>" +
      "<li>No limits (coming soon)</li>" +
      "</ul>" +
      '<div class="modal-actions">' +
      '<button type="button" class="btn btn-primary" id="nsb-pro-upgrade-btn">Upgrade</button>' +
      '<button type="button" class="btn btn-secondary" data-nsb-modal-close>Close</button>' +
      "</div>" +
      '<div class="modal-pro-already-row">' +
      '<button type="button" class="btn btn-secondary btn-sm" id="nsb-pro-already-paid">Log in</button>' +
      "</div>" +
      '<div id="nsb-pro-unlock" class="modal-pro-unlock" hidden>' +
      '<label for="nsb-pro-email">Email</label>' +
      '<input type="email" id="nsb-pro-email" class="input" placeholder="you@example.com" maxlength="254">' +
      '<p class="small muted" style="margin-top:.25rem;">Use the email you paid with.</p>' +
      '<p id="nsb-pro-email-error" class="modal-pro-error" hidden></p>' +
      '<button type="button" class="btn btn-primary" id="nsb-pro-unlock-btn">Unlock Pro</button>' +
      "</div>" +
      logOutHtml +
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

    function rerenderHeader() {
      if (typeof window.NSB_HEADER !== "undefined" && window.NSB_HEADER.render) {
        window.NSB_HEADER.render();
      }
    }

    // Upgrade button: open Stripe checkout URL
    var upgradeBtn = overlay.querySelector("#nsb-pro-upgrade-btn");
    if (upgradeBtn) {
      upgradeBtn.addEventListener("click", function () {
        var checkoutUrl = window.NSB_CONFIG && window.NSB_CONFIG.PRO_CHECKOUT_URL;
        if (checkoutUrl) {
          window.open(checkoutUrl, "_blank", "noopener,noreferrer");
        } else {
          showToast("Checkout not configured.");
        }
      });
    }

    // Log in toggle
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

    // Unlock Pro: real license verify
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
        unlockBtn.disabled = true;
        unlockBtn.textContent = "Checking...";
        emailError.hidden = true;

        verifyEmail(email)
          .then(function (active) {
            unlockBtn.disabled = false;
            unlockBtn.textContent = "Unlock Pro";
            if (active === true) {
              setPro(true, email);
              showToast("Pro unlocked");
              closeModal();
              rerenderHeader();
            } else if (active === false) {
              emailError.textContent = "No active Pro found for that email.";
              emailError.hidden = false;
            } else {
              // null = network error
              emailError.textContent = "Could not reach the license server. Try again.";
              emailError.hidden = false;
            }
          });
      });
    }

    // Log out (only shown when already Pro)
    var logoutBtn = overlay.querySelector("#nsb-pro-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        setPro(false);
        closeModal();
        rerenderHeader();
      });
    }

    // Debug: Disable Pro
    var disableLink = overlay.querySelector("#nsb-pro-disable-link");
    if (disableLink) {
      disableLink.addEventListener("click", function (e) {
        e.preventDefault();
        setPro(false);
        closeModal();
        rerenderHeader();
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
    requirePro: requirePro,
    verifyEmail: verifyEmail,
  };

  if (typeof window.NSB_OPEN_UPGRADE !== "undefined") {
    window.NSB_OPEN_UPGRADE = function () { openUpgradeModal(); };
  }

  // Background re-verify on load: correct Pro state silently
  try {
    var storedEmail = localStorage.getItem(STORAGE_EMAIL_KEY);
    if (storedEmail) {
      verifyEmail(storedEmail).then(function (active) {
        if (active === false) {
          // Subscription lapsed or revoked
          setPro(false);
          if (typeof window.NSB_HEADER !== "undefined" && window.NSB_HEADER.render) {
            window.NSB_HEADER.render();
          }
        }
        // active===true: keep as-is. active===null: network error, keep as-is.
      });
    }
  } catch (_) {}
})();
