/**
 * NSB Tools - Modal component
 */

(function () {
  "use strict";

  window.NSB_MODAL = {
    open(content, options) {
      const overlay = document.getElementById("nsb-modal-overlay") || createOverlay();
      overlay.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="nsb-modal-title">
          <div id="nsb-modal-content">${typeof content === "string" ? content : (content && content.innerHTML) || ""}</div>
        </div>
      `;
      overlay.hidden = false;
      overlay.style.display = "flex";
      document.body.style.overflow = "hidden";

      overlay.addEventListener("click", function closeOnBackdrop(e) {
        if (e.target === overlay) {
          overlay.hidden = true;
          overlay.style.display = "none";
          document.body.style.overflow = "";
          overlay.removeEventListener("click", closeOnBackdrop);
        }
      });

      const closeBtn = overlay.querySelector("[data-nsb-modal-close]");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => {
          overlay.hidden = true;
          overlay.style.display = "none";
          document.body.style.overflow = "";
        });
      }
    },

    close() {
      const overlay = document.getElementById("nsb-modal-overlay");
      if (overlay) {
        overlay.hidden = true;
        overlay.style.display = "none";
        document.body.style.overflow = "";
      }
    }
  };

  function createOverlay() {
    const el = document.createElement("div");
    el.id = "nsb-modal-overlay";
    el.className = "modal-overlay";
    el.setAttribute("hidden", "");
    document.body.appendChild(el);
    return el;
  }
})();
