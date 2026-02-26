(function () {
  "use strict";
  function addRecent(s) { const r = window.NSB_UTILS.storage.get("nsb_recent", []); window.NSB_UTILS.storage.set("nsb_recent", [s, ...r.filter(x => x !== s)].slice(0, 10)); }
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("nsb-form"), out = document.getElementById("nsb-output");
    const copyBtn = document.getElementById("nsb-copy"), saveBtn = document.getElementById("nsb-save"), clearBtn = document.getElementById("nsb-clear"), shareBtn = document.getElementById("nsb-share");
    if (!form || !out) return;
    function run() {
      const inputs = { principal: (form.querySelector("[name=principal]")||{}).value||"", rate: (form.querySelector("[name=rate]")||{}).value||"", years: (form.querySelector("[name=years]")||{}).value||"10", noi: (form.querySelector("[name=noi]")||{}).value||"" };
      const res = window.NSB_SBA.calculate(inputs);
      if (!res) { out.textContent = "Enter principal and rate."; return; }
      addRecent("sba-payment-estimator");
      let text = "Monthly P&I: $" + res.monthlyPI.toFixed(2) + "\nAnnual debt service: $" + res.annualDebt.toFixed(2);
      if (res.dscr != null) text += "\nDSCR: " + res.dscr.toFixed(2);
      else text += "\nDSCR: (enter NOI to calculate)";
      out.textContent = text; out.dataset.raw = text;
    }
    const main = document.querySelector("main");
    async function runWithThinking() {
      window.NSB_UTILS.setBusy(main, true);
      await window.NSB_UTILS.sleep(window.NSB_UTILS.randInt(450, 900));
      try { run(); } finally { window.NSB_UTILS.setBusy(main, false); }
    }
    form.addEventListener("submit", e => { e.preventDefault(); runWithThinking(); });
    form.addEventListener("input", window.NSB_UTILS.debounce(run, 400));
    copyBtn && copyBtn.addEventListener("click", () => { const t = out.dataset.raw || out.textContent; if (t && window.NSB_UTILS.copyToClipboard(t)) window.NSB_TOAST.show("Copied"); });
    saveBtn && saveBtn.addEventListener("click", () => { const t = out.dataset.raw || out.textContent; if (t) { const s = window.NSB_UTILS.storage.get("nsb_saved",[]); s.push({tool:"sba-payment-estimator",text:t,at:new Date().toISOString()}); window.NSB_UTILS.storage.set("nsb_saved", s.slice(-20)); window.NSB_TOAST.show("Saved"); } });
    clearBtn && clearBtn.addEventListener("click", () => { out.textContent = ""; delete out.dataset.raw; });
    shareBtn && shareBtn.addEventListener("click", () => { if (window.NSB_UTILS.copyToClipboard(window.location.href.split("?")[0])) window.NSB_TOAST.show("Share link copied"); });
  });
})();
