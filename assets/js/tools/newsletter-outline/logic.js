(function () {
  "use strict";
  const SECTIONS = ["Lead: Hook the reader", "Context: Why this matters", "Main points: 3-5 bullets", "Story or example", "CTA: What to do next"];
  const SUBJECTS = ["The one thing about {topic}", "Your weekly dose of {topic}", "{topic}: What I learned"];
  const CTAS = ["Reply with your take", "Share with a friend", "Try this and report back", "Save for later"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_NEWSLETTER = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const topic = (inputs.topic || "your topic").slice(0, 50);
      const t = topic || "this";
      const sections = SECTIONS.map((s, i) => (i + 1) + ". " + s).join("\n");
      const subject = pick(SUBJECTS, rnd).replace(/\{topic\}/g, t);
      const cta = pick(CTAS, rnd);
      return "SUBJECT LINES:\n" + subject + "\n\nOUTLINE:\n" + sections + "\n\nCTA: " + cta;
    }
  };
})();
