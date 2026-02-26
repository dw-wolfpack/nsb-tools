(function () {
  "use strict";
  const RED_FLAGS = ["as-is", "no warranty", "contingent", "seller financing required", "off-market", "undisclosed", "material adverse", "best efforts"];
  const DILIGENCE = ["Verify revenue figures with documentation", "Confirm customer concentration", "Review lease terms and transferability", "Check for pending litigation", "Validate EBITDA adjustments"];
  window.NSB_DEAL_TEASER = {
    generate(inputs, seed) {
      const text = (inputs.text || "").trim();
      const out = { fields: {}, redFlags: [], diligence: [] };
      const lower = text.toLowerCase();
      const dollarMatch = text.match(/\$[\d,]+(?:\.\d{2})?(?:\s*(?:M|MM|million|K|k))?/gi);
      const pctMatch = text.match(/\d+(?:\.\d+)?\s*%/g);
      if (dollarMatch) out.fields.PriceRange = dollarMatch.slice(0, 3).join(", ");
      if (pctMatch) out.fields.MarginsOrGrowth = pctMatch.slice(0, 3).join(", ");
      const words = lower.split(/\s+/);
      words.forEach(w => {
        const clean = w.replace(/[^a-z]/g, "");
        if (RED_FLAGS.some(r => clean.includes(r.replace(/\s/g, "")))) out.redFlags.push(w);
      });
      out.redFlags = [...new Set(out.redFlags)].slice(0, 5);
      if (out.redFlags.length === 0) out.redFlags.push("None detected (manual review still advised)");
      out.diligence = DILIGENCE.slice(0, 5);
      return out;
    }
  };
})();
