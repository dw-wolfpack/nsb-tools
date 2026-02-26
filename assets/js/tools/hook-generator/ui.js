(function () {
  "use strict";
  function addRecent(slug) { const r = window.NSB_UTILS.storage.get("nsb_recent", []); window.NSB_UTILS.storage.set("nsb_recent", [slug, ...r.filter(x => x !== slug)].slice(0, 10)); }
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("nsb-form"); const out = document.getElementById("nsb-output");
    const copyBtn = document.getElementById("nsb-copy"); const saveBtn = document.getElementById("nsb-save");
    const clearBtn = document.getElementById("nsb-clear"); const shareBtn = document.getElementById("nsb-share");
    const gen = document.getElementById("nsb-generate"); const regen = document.getElementById("nsb-regen");
    if (!form || !out) return;
    function getInputs() {
      return { topic: (form.querySelector("[name=topic]")||{}).value||"", types: (form.querySelector("[name=types]")||{}).value||"curiosity,contrarian,authority,story", perType: (form.querySelector("[name=perType]")||{}).value||"3" };
    }
    function run() {
      if (!window.NSB_CAN_GENERATE(true)) { window.NSB_OPEN_UPGRADE(); return; }
      const inputs = getInputs();
      const results = window.NSB_HOOK_GENERATOR.generate(inputs, window.NSB_UTILS.hash(JSON.stringify(inputs) + Date.now()));
      const byType = {}; results.forEach(r => { if (!byType[r.type]) byType[r.type] = []; byType[r.type].push(r.text); });
      out.innerHTML = Object.entries(byType).map(([k, v]) => `<h4>${k}</h4><ul>${v.map(t => `<li>${t.replace(/</g,"&lt;")}</li>`).join("")}</ul>`).join("");
      out.dataset.raw = results.map(r => `[${r.type}] ${r.text}`).join("\n");
      if (window.NSB_INCREMENT_GEN) window.NSB_INCREMENT_GEN();
      addRecent("hook-generator"); window.nsbAnalytics.track("tool_generate", { tool: "hook-generator" });
    }
    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }
    gen && gen.addEventListener("click", () => runWithThinking()); regen && regen.addEventListener("click", () => runWithThinking());
    form && form.addEventListener("submit", e => { e.preventDefault(); runWithThinking(); });
    copyBtn && copyBtn.addEventListener("click", () => { const t = out.dataset.raw || out.innerText; if (t && window.NSB_UTILS.copyToClipboard(t)) { window.NSB_TOAST.show("Copied"); window.nsbAnalytics.track("tool_copy", { tool: "hook-generator" }); } });
    saveBtn && saveBtn.addEventListener("click", () => { const t = out.dataset.raw || out.innerText; if (t) { const s = window.NSB_UTILS.storage.get("nsb_saved",[]); s.push({tool:"hook-generator",text:t,at:new Date().toISOString()}); window.NSB_UTILS.storage.set("nsb_saved", s.slice(-20)); window.NSB_TOAST.show("Saved"); } });
    clearBtn && clearBtn.addEventListener("click", () => { out.innerHTML = ""; delete out.dataset.raw; });
    shareBtn && shareBtn.addEventListener("click", () => { if (window.NSB_UTILS.copyToClipboard(window.location.href.split("?")[0])) window.NSB_TOAST.show("Share link copied"); });
  });
})();
