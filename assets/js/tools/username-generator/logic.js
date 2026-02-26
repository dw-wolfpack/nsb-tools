/**
 * Username Generator - deterministic logic
 */
(function () {
  "use strict";

  const ADJ = ["bold", "clear", "keen", "quick", "bright", "calm", "true", "wise", "prime", "pure", "swift", "lucid", "apt", "brave", "fresh", "sharp"];
  const NOUN = ["mind", "path", "flow", "craft", "pulse", "mark", "line", "core", "base", "edge", "drive", "wave", "node", "lane", "plot", "voice"];
  const PATTERNS = ["{adj}{noun}", "{adj}_{noun}", "{noun}_{adj}", "the{adj}{noun}", "{adj}{noun}{num}"];

  function pick(arr, rnd) {
    return arr[Math.floor(rnd() * arr.length)];
  }

  function slugify(s) {
    return String(s || "").toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "").slice(0, 20);
  }

  window.NSB_USERNAME_GENERATOR = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const niche = slugify(inputs.niche) || pick(NOUN, rnd);
      const kw = slugify(inputs.keywords) || "";
      const name = slugify(inputs.name) || "";
      const count = Math.min(10, Math.max(5, parseInt(inputs.count, 10) || 8));
      const seen = new Set();
      const out = [];

      for (let i = 0; i < count * 2 && out.length < count; i++) {
        const adj = pick(ADJ, rnd);
        const noun = pick(NOUN, rnd);
        const num = Math.floor(rnd() * 999) + 1;
        let raw = pick(PATTERNS, rnd)
          .replace("{adj}", adj)
          .replace("{noun}", noun)
          .replace("{num}", num);
        if (kw) raw = raw + kw.slice(0, 4);
        if (name) raw = name.slice(0, 4) + raw;
        const clean = raw.replace(/[^a-z0-9_]/g, "").slice(0, 30);
        if (!seen.has(clean) && clean.length >= 4) {
          seen.add(clean);
          out.push(clean);
        }
      }
      return out;
    }
  };
})();
