(function () {
  "use strict";
  function addRecent(s) { const r = window.NSB_UTILS.storage.get("nsb_recent", []); window.NSB_UTILS.storage.set("nsb_recent", [s, ...r.filter(x => x !== s)].slice(0, 10)); }
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("nsb-form"), out = document.getElementById("nsb-output");
    const copyBtn = document.getElementById("nsb-copy"), saveBtn = document.getElementById("nsb-save"), clearBtn = document.getElementById("nsb-clear"), shareBtn = document.getElementById("nsb-share");
    const gen = document.getElementById("nsb-generate"), regen = document.getElementById("nsb-regen");
    if (!form || !out) return;
    function run() {
      if (!window.NSB_CAN_GENERATE(true)) { window.NSB_OPEN_UPGRADE(); return; }
      const inputs = { text: (form.querySelector("[name=text]")||{}).value||"" };
      const res = window.NSB_DEAL_TEASER.generate(inputs, 0);
      let html = "<h4>Extracted fields</h4><ul>";
      Object.entries(res.fields).forEach(([k, v]) => { if (v) html += "<li><strong>" + k + ":</strong> " + v + "</li>"; });
      if (Object.keys(res.fields).length === 0) html += "<li>No obvious fields detected. Paste more context.</li>";
      html += "</ul><h4>Red flags</h4><ul>" + res.redFlags.map(r => "<li>" + r.replace(/</g, "&lt;") + "</li>").join("") + "</ul>";
      html += "<h4>Diligence questions</h4><ul>" + res.diligence.map(d => "<li>" + d + "</li>").join("") + "</ul>";
      out.innerHTML = html; out.dataset.raw = JSON.stringify(res);
      if (window.NSB_INCREMENT_GEN) window.NSB_INCREMENT_GEN();
      addRecent("deal-teaser-analyzer"); window.nsbAnalytics.track("tool_generate", { tool: "deal-teaser-analyzer" });
    }
    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }
    gen && gen.addEventListener("click", () => runWithThinking()); regen && regen.addEventListener("click", () => runWithThinking());
    form && form.addEventListener("submit", e => { e.preventDefault(); runWithThinking(); });
    copyBtn && copyBtn.addEventListener("click", () => { const t = out.innerText; if (t && window.NSB_UTILS.copyToClipboard(t)) { window.NSB_TOAST.show("Copied"); window.nsbAnalytics.track("tool_copy", { tool: "deal-teaser-analyzer" }); } });
    saveBtn && saveBtn.addEventListener("click", () => { const t = out.innerText; if (t) { const s = window.NSB_UTILS.storage.get("nsb_saved",[]); s.push({tool:"deal-teaser-analyzer",text:t,at:new Date().toISOString()}); window.NSB_UTILS.storage.set("nsb_saved", s.slice(-20)); window.NSB_TOAST.show("Saved"); } });
    clearBtn && clearBtn.addEventListener("click", () => { out.innerHTML = ""; delete out.dataset.raw; });
    shareBtn && shareBtn.addEventListener("click", () => { if (window.NSB_UTILS.copyToClipboard(window.location.href.split("?")[0])) window.NSB_TOAST.show("Share link copied"); });
  });
})();
