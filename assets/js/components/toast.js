/**
 * NSB Tools - Toast component
 */

(function () {
  "use strict";

  let toastEl;
  let toastTimeout;

  function ensureToast() {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }

  window.NSB_TOAST = {
    show(message, duration) {
      const el = ensureToast();
      clearTimeout(toastTimeout);
      el.textContent = message;
      el.classList.add("show");
      toastTimeout = setTimeout(() => {
        el.classList.remove("show");
      }, duration || 2500);
    }
  };
})();
