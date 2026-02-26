(function () {
  "use strict";
  const BROAD = ["explore", "creator", "content", "growth", "tips", "learn", "daily", "inspo"];
  const NICHE = ["creatorlife", "contenttips", "growthhack", "buildinpublic", "creatorcommunity"];
  const COMMUNITY = ["smallbusiness", "entrepreneurlife", "creatoreconomy", "solopreneur"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  function shuffle(arr, rnd) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  window.NSB_HASHTAG = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const niche = (inputs.niche || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "").slice(0, 20);
      const kw = (inputs.keywords || "").split(/[\s,]+/).map(s => s.replace(/[^a-z0-9]/gi, "").toLowerCase()).filter(Boolean).slice(0, 5);
      const count = Math.min(15, Math.max(5, parseInt(inputs.count, 10) || 10));
      const out = { broad: [], niche: [], community: [] };
      const allTags = new Set();
      [BROAD, [...NICHE, ...(niche ? [niche] : [])], COMMUNITY].forEach((arr, i) => {
        const keys = ["broad", "niche", "community"];
        const n = Math.ceil(count / 3);
        shuffle(arr, rnd).concat(kw).forEach(t => {
          if (t && !allTags.has(t) && out[keys[i]].length < n) {
            allTags.add(t); out[keys[i]].push("#" + t);
          }
        });
      });
      return out;
    }
  };
})();
