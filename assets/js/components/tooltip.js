/**
 * NSB Tools - Tooltip component (glossary term hints)
 */
(function () {
  "use strict";

  var activeBubble = null;
  var activeBtn = null;

  function isTouch() {
    try {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    } catch (e) {
      return false;
    }
  }

  function hide() {
    if (activeBubble && activeBubble.parentNode) {
      activeBubble.parentNode.removeChild(activeBubble);
    }
    activeBubble = null;
    if (activeBtn) {
      activeBtn.setAttribute("aria-expanded", "false");
      activeBtn.removeAttribute("aria-describedby");
      activeBtn = null;
    }
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("click", onClickOutside);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") hide();
  }

  function onClickOutside(e) {
    if (activeBubble && activeBtn && e.target !== activeBtn && activeBubble !== e.target && !activeBubble.contains(e.target)) {
      hide();
    }
  }

  function show(btn, entry) {
    hide();
    if (!entry) return;
    var bubble = document.createElement("div");
    bubble.className = "tip-bubble";
    bubble.setAttribute("role", "tooltip");
    bubble.setAttribute("id", "nsb-tooltip-" + entry.key);
    bubble.innerHTML = "<strong>" + escapeHtml(entry.term) + "</strong>: " + escapeHtml(entry.short) +
      ' <a href="/glossary/#' + escapeAttr(entry.key) + '" class="tip-learn">Learn more</a>';
    document.body.appendChild(bubble);
    activeBubble = bubble;
    activeBtn = btn;
    btn.setAttribute("aria-expanded", "true");
    btn.setAttribute("aria-describedby", bubble.id);

    var rect = btn.getBoundingClientRect();
    var bubbleRect = bubble.getBoundingClientRect();
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var scrollX = window.scrollX || document.documentElement.scrollLeft;
    var top = rect.bottom + scrollY + 6;
    var left = rect.left + scrollX + (rect.width / 2) - (bubbleRect.width / 2);
    if (left < 8) left = 8;
    if (left + bubbleRect.width > document.documentElement.clientWidth - 8) {
      left = document.documentElement.clientWidth - bubbleRect.width - 8;
    }
    bubble.style.position = "absolute";
    bubble.style.top = top + "px";
    bubble.style.left = left + "px";

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClickOutside);
  }

  function escapeHtml(s) {
    if (s == null) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function escapeAttr(s) {
    if (s == null) return "";
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function initButton(btn) {
    var key = btn.getAttribute("data-tooltip-key");
    if (!key) return;
    var glossary = window.NSB_GLOSSARY;
    if (!glossary || !glossary.get) return;
    var entry = glossary.get(key);
    if (!entry) return;

    var term = entry.term || key;
    btn.setAttribute("aria-label", "What is " + term + "?");
    btn.setAttribute("type", "button");
    btn.setAttribute("aria-expanded", "false");

    if (isTouch()) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (activeBtn === btn && activeBubble) {
          hide();
        } else {
          show(btn, entry);
        }
      });
    } else {
      btn.addEventListener("mouseenter", function () {
        show(btn, entry);
      });
      btn.addEventListener("mouseleave", function () {
        hide();
      });
    }
  }

  window.NSB_TOOLTIP = {
    attach: function (rootEl) {
      if (!rootEl) rootEl = document;
      var btns = rootEl.querySelectorAll("[data-tooltip-key]");
      for (var i = 0; i < btns.length; i++) {
        initButton(btns[i]);
      }
    }
  };
})();
