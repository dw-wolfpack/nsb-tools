(function () {
  "use strict";
  const VERBS = ["Led", "Managed", "Increased", "Reduced", "Developed", "Implemented", "Achieved", "Streamlined", "Optimized", "Launched", "Coordinated"];
  const METRICS = ["X%", "X% growth", "by X%", "X users", "X% improvement"];
  const RESULTS = ["resulting in", "leading to", "which enabled"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_RESUME_BULLET = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const bullet = (inputs.bullet || "").trim().slice(0, 300);
      const n = Math.min(5, Math.max(2, parseInt(inputs.count, 10) || 3));
      const out = [];
      for (let i = 0; i < n; i++) {
        const verb = pick(VERBS, rnd);
        const metric = pick(METRICS, rnd);
        const result = pick(RESULTS, rnd);
        const base = bullet.replace(/^(led|managed|increased|developed|achieved|implemented)\s+/i, "").replace(/\d+%?/g, "[metric]");
        out.push(verb + " " + base + " " + metric + ", " + result + " [outcome].");
      }
      return out;
    }
  };
})();
