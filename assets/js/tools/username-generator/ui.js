/**
 * Username Generator - UI binding
 */
(function () {
  "use strict";

  function addToRecent(slug) {
    const recent = window.NSB_UTILS.storage.get("nsb_recent", []);
    const next = [slug, ...recent.filter(s => s !== slug)].slice(0, 10);
    window.NSB_UTILS.storage.set("nsb_recent", next);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("nsb-form");
    const output = document.getElementById("nsb-output");
    const copyBtn = document.getElementById("nsb-copy");
    const saveBtn = document.getElementById("nsb-save");
    const clearBtn = document.getElementById("nsb-clear");
    const shareBtn = document.getElementById("nsb-share");
    const genBtn = document.getElementById("nsb-generate");
    const regenBtn = document.getElementById("nsb-regen");

    if (!form || !output) return;

    function getInputs() {
      return {
        niche: (form.querySelector("[name=niche]") || {}).value || "",
        keywords: (form.querySelector("[name=keywords]") || {}).value || "",
        name: (form.querySelector("[name=name]") || {}).value || "",
        count: (form.querySelector("[name=count]") || {}).value || "8"
      };
    }

    function run() {
      if (!window.NSB_CAN_GENERATE(true)) {
        window.NSB_OPEN_UPGRADE();
        return;
      }
      const inputs = getInputs();
      const seed = window.NSB_UTILS.hash(JSON.stringify(inputs) + Date.now());
      const results = window.NSB_USERNAME_GENERATOR.generate(inputs, seed);
      output.textContent = results.join("\n");
      output.dataset.raw = results.join("\n");
      if (window.NSB_INCREMENT_GEN) window.NSB_INCREMENT_GEN();
      addToRecent("username-generator");
      window.nsbAnalytics.track("tool_generate", { tool: "username-generator" });
    }

    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }

    genBtn && genBtn.addEventListener("click", () => runWithThinking());
    regenBtn && regenBtn.addEventListener("click", () => runWithThinking());
    form && form.addEventListener("submit", function (e) { e.preventDefault(); runWithThinking(); });

    copyBtn && copyBtn.addEventListener("click", function () {
      const text = output.dataset.raw || output.textContent;
      if (text && window.NSB_UTILS.copyToClipboard(text)) {
        window.NSB_TOAST.show("Copied to clipboard");
        window.nsbAnalytics.track("tool_copy", { tool: "username-generator" });
      }
    });

    saveBtn && saveBtn.addEventListener("click", function () {
      const text = output.dataset.raw || output.textContent;
      if (text) {
        const saved = window.NSB_UTILS.storage.get("nsb_saved", []);
        saved.push({ tool: "username-generator", text, at: new Date().toISOString() });
        window.NSB_UTILS.storage.set("nsb_saved", saved.slice(-20));
        window.NSB_TOAST.show("Saved");
      }
    });

    clearBtn && clearBtn.addEventListener("click", function () {
      output.textContent = "";
      delete output.dataset.raw;
    });

    shareBtn && shareBtn.addEventListener("click", function () {
      const url = window.location.href.split("?")[0];
      if (window.NSB_UTILS.copyToClipboard(url)) {
        window.NSB_TOAST.show("Share link copied");
      }
    });
  });
})();
