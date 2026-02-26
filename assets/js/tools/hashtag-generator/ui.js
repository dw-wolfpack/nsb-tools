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
      const inputs = { niche: (form.querySelector("[name=niche]")||{}).value||"", keywords: (form.querySelector("[name=keywords]")||{}).value||"", count: (form.querySelector("[name=count]")||{}).value||"10" };
      const res = window.NSB_HASHTAG.generate(inputs, window.NSB_UTILS.hash(JSON.stringify(inputs) + Date.now()));
      const flat = [...res.broad, ...res.niche, ...res.community];
      out.innerHTML = "<h4>Broad</h4><p>" + res.broad.join(" ") + "</p><h4>Niche</h4><p>" + res.niche.join(" ") + "</p><h4>Community</h4><p>" + res.community.join(" ") + "</p>";
      out.dataset.raw = flat.join(" "); out.dataset.json = JSON.stringify(res);
      if (window.NSB_INCREMENT_GEN) window.NSB_INCREMENT_GEN();
      addRecent("hashtag-generator"); window.nsbAnalytics.track("tool_generate", { tool: "hashtag-generator" });
    }
    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }
    gen && gen.addEventListener("click", () => runWithThinking()); regen && regen.addEventListener("click", () => runWithThinking());
    form && form.addEventListener("submit", e => { e.preventDefault(); runWithThinking(); });
    copyBtn && copyBtn.addEventListener("click", () => { const t = out.dataset.raw; if (t && window.NSB_UTILS.copyToClipboard(t)) { window.NSB_TOAST.show("Copied"); window.nsbAnalytics.track("tool_copy", { tool: "hashtag-generator" }); } });
    saveBtn && saveBtn.addEventListener("click", () => { const t = out.dataset.raw; if (t) { const s = window.NSB_UTILS.storage.get("nsb_saved",[]); s.push({tool:"hashtag-generator",text:t,at:new Date().toISOString()}); window.NSB_UTILS.storage.set("nsb_saved", s.slice(-20)); window.NSB_TOAST.show("Saved"); } });
    clearBtn && clearBtn.addEventListener("click", () => { out.innerHTML = ""; delete out.dataset.raw; delete out.dataset.json; });
    shareBtn && shareBtn.addEventListener("click", () => { if (window.NSB_UTILS.copyToClipboard(window.location.href.split("?")[0])) window.NSB_TOAST.show("Share link copied"); });
    csvBtn && csvBtn.addEventListener("click", () => { try { const j = JSON.parse(out.dataset.json || "{}"); const rows = [["Type","Hashtags"], ...["broad","niche","community"].map(k => [k, (j[k]||[]).join(" ")])]; window.NSB_UTILS.downloadFile(window.NSB_UTILS.exportCSV(rows), "hashtags.csv", "text/csv"); window.nsbAnalytics.track("tool_export", { tool: "hashtag-generator" }); } catch(e) {} });
  });
})();
