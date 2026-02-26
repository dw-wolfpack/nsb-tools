(function () {
  "use strict";
  const SITUATIONS = ["I was faced with", "The situation was", "I stepped into"];
  const TASKS = ["My role was to", "I had to", "The challenge was"];
  const ACTIONS = ["I decided to", "I organized", "I led"];
  const RESULTS = ["The outcome was", "As a result", "This led to"];
  const FOLLOWUPS = ["What would you do differently?", "What was the toughest part?", "How did you measure success?"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_STAR = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const notes = (inputs.notes || "").trim().slice(0, 500);
      const concise = inputs.mode !== "detailed";
      const s = pick(SITUATIONS, rnd);
      const t = pick(TASKS, rnd);
      const a = pick(ACTIONS, rnd);
      const r = pick(RESULTS, rnd);
      const context = notes ? "\n\n(Your notes: " + notes + ")" : "";
      let out = "Situation: " + s + " [describe context].\nTask: " + t + " [describe your role].\nAction: " + a + " [describe what you did].\nResult: " + r + " [describe outcome]." + context;
      if (!concise) out += "\n\nDETAILED (expand each):\n- Situation: 2-3 sentences\n- Task: 1-2 sentences\n- Action: 3-4 sentences (steps)\n- Result: 1-2 sentences with metrics";
      out += "\n\nFOLLOW-UP QUESTIONS:\n" + FOLLOWUPS.slice(0, 3).map((q, i) => (i + 1) + ". " + q).join("\n");
      return out;
    }
  };
})();
