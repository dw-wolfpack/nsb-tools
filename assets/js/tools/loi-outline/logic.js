(function () {
  "use strict";
  const BULLETS = [
    "Purchase price: [amount]",
    "Asset type: [description]",
    "Financing structure: [cash/SBA/conventional]",
    "Earnest money / deposit: [amount]",
    "Closing timeline: [date or days]",
    "Contingencies: [financing, inspection, etc.]",
    "Due diligence period: [days]",
    "Exclusivity period: [days]"
  ];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_LOI = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const asset = (inputs.asset || "business/property").slice(0, 80);
      const price = (inputs.price || "[price]").slice(0, 50);
      const financing = (inputs.financing || "TBD").slice(0, 50);
      const n = Math.min(8, Math.max(4, parseInt(inputs.count, 10) || 6));
      const out = [
        "Asset: " + asset,
        "Purchase price: " + price,
        "Financing structure: " + financing
      ];
      const extra = BULLETS.filter(b => !b.startsWith("Purchase price") && !b.startsWith("Asset type") && !b.startsWith("Financing structure"));
      extra.sort(() => rnd() - 0.5);
      for (let i = 0; i < n - 3 && i < extra.length; i++) out.push(extra[i]);
      return out.slice(0, n);
    }
  };
})();
