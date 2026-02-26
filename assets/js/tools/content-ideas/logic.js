(function () {
  "use strict";
  const ANGLES = ["Myth busting", "Step-by-step", "Common mistakes", "Behind the scenes", "Quick wins", "Before/after", "FAQ style"];
  const HOOKS = ["The one thing...", "What nobody tells you", "Why most people fail", "3 ways to", "How I"];
  const FORMATS = ["Carousel", "Reel", "Story thread", "Video", "Thread"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_CONTENT_IDEAS = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const niche = (inputs.niche || "your niche").slice(0, 50);
      const n = Math.min(8, Math.max(3, parseInt(inputs.count, 10) || 5));
      const seen = new Set();
      const out = [];
      for (let i = 0; i < n * 2 && out.length < n; i++) {
        const angle = pick(ANGLES, rnd);
        const hook = pick(HOOKS, rnd);
        const format = pick(FORMATS, rnd);
        const key = angle + "|" + hook + "|" + format;
        if (!seen.has(key)) {
          seen.add(key);
          out.push({ angle, hook: hook + " " + niche, format });
        }
      }
      return out;
    }
  };
})();
