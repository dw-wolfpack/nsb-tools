(function () {
  "use strict";
  const HOOKS = ["Nobody talks about this.", "Here's what changed everything.", "The one thing..."];
  const PROBLEMS = ["The biggest mistake people make", "Why most people fail", "What nobody tells you"];
  const SOLUTIONS = ["Do this instead", "Try this simple shift", "Start with this"];
  const CTAS = ["Follow for more", "Save this", "Drop a comment below"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_SHORT_SCRIPT = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const topic = (inputs.topic || "your niche").slice(0, 50);
      const out = [];
      out.push("HOOK (0-3 sec): " + pick(HOOKS, rnd).replace("this", topic));
      out.push("PROBLEM (3-8 sec): " + pick(PROBLEMS, rnd) + " with " + topic + ": ...");
      out.push("SOLUTION (8-20 sec): " + pick(SOLUTIONS, rnd) + ". " + topic + " tip: [your tip]");
      out.push("CTA (20-30 sec): " + pick(CTAS, rnd));
      out.push("");
      out.push("SHOT LIST: 1) Hook B-roll 2) Talking head 3) Demo/example 4) CTA screen");
      out.push("");
      out.push("CAPTION: " + pick(HOOKS, rnd) + " Full breakdown in the comments.");
      return out.join("\n");
    }
  };
})();
