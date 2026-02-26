(function () {
  "use strict";
  function addRecent(s) { const r = window.NSB_UTILS.storage.get("nsb_recent", []); window.NSB_UTILS.storage.set("nsb_recent", [s, ...r.filter(x => x !== s)].slice(0, 10)); }
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("nsb-form"), out = document.getElementById("nsb-output");
    const copyBtn = document.getElementById("nsb-copy"), saveBtn = document.getElementById("nsb-save"), clearBtn = document.getElementById("nsb-clear"), shareBtn = document.getElementById("nsb-share"), csvBtn = document.getElementById("nsb-csv");
    const gen = document.getElementById("nsb-generate"), regen = document.getElementById("nsb-regen");
    if (!form || !out) return;
    function run() {
      if (!window.NSB_CAN_GENERATE(true)) { window.NSB_OPEN_UPGRADE(); return; }
      const inputs = { niche: (form.querySelector("[name=niche]")||{}).value||"", count: (form.querySelector("[name=count]")||{}).value||"5" };
      const results = window.NSB_CONTENT_IDEAS.generate(inputs, window.NSB_UTILS.hash(JSON.stringify(inputs) + Date.now()));
      const text = results.map((r, i) => (i + 1) + ". " + r.angle + " | " + r.hook + " [" + r.format + "]").join("\n");
      out.textContent = text; out.dataset.raw = text; out.dataset.json = JSON.stringify(results);
      if (window.NSB_INCREMENT_GEN) window.NSB_INCREMENT_GEN();
      addRecent("content-ideas"); window.nsbAnalytics.track("tool_generate", { tool: "content-ideas" });
    }
    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }
    gen && gen.addEventListener("click", () => runWithThinking()); regen && regen.addEventListener("click", () => runWithThinking());
    form && form.addEventListener("submit", e => { e.preventDefault(); runWithThinking(); });
    copyBtn && copyBtn.addEventListener("click", () => { const t = out.dataset.raw; if (t && window.NSB_UTILS.copyToClipboard(t)) { window.NSB_TOAST.show("Copied"); window.nsbAnalytics.track("tool_copy", { tool: "content-ideas" }); } });
    saveBtn && saveBtn.addEventListener("click", () => { const t = out.dataset.raw; if (t) { const s = window.NSB_UTILS.storage.get("nsb_saved",[]); s.push({tool:"content-ideas",text:t,at:new Date().toISOString()}); window.NSB_UTILS.storage.set("nsb_saved", s.slice(-20)); window.NSB_TOAST.show("Saved"); } });
    clearBtn && clearBtn.addEventListener("click", () => { out.textContent = ""; delete out.dataset.raw; delete out.dataset.json; });
    shareBtn && shareBtn.addEventListener("click", () => { if (window.NSB_UTILS.copyToClipboard(window.location.href.split("?")[0])) window.NSB_TOAST.show("Share link copied"); });
    csvBtn && csvBtn.addEventListener("click", () => { try { const j = JSON.parse(out.dataset.json || "[]"); const rows = j.map(r => ({ Angle: r.angle, Hook: r.hook, Format: r.format })); window.NSB_UTILS.downloadFile(window.NSB_UTILS.exportCSV(rows), "content-ideas.csv", "text/csv"); window.nsbAnalytics.track("tool_export", { tool: "content-ideas" }); } catch(e) {} });
  });
})();
