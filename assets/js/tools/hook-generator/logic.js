(function () {
  "use strict";
  const HOOKS = {
    curiosity: ["Nobody talks about this...", "The one thing that changed everything...", "What they don't tell you about {t}...", "The secret behind {t}..."],
    contrarian: ["Unpopular opinion: {t}", "Stop doing {t}. Do this instead.", "Forget what you heard about {t}.", "The truth about {t} nobody wants to hear."],
    authority: ["After 10 years in {t}, here's what I learned...", "I've seen hundreds of {t}. Here's what works.", "As someone who does {t} daily..."],
    story: ["Last year I was struggling with {t}...", "I used to think {t} until...", "Here's what happened when I tried {t}..."]
  };
  const TYPES = ["curiosity", "contrarian", "authority", "story"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_HOOK_GENERATOR = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const topic = (inputs.topic || "your niche").trim().slice(0, 50);
      const t = topic || "this";
      const types = inputs.types ? inputs.types.split(",").map(s => s.trim()).filter(Boolean) : TYPES;
      const perType = Math.max(2, Math.min(4, parseInt(inputs.perType, 10) || 3));
      const out = [];
      types.forEach(ty => {
        const arr = HOOKS[ty] || HOOKS.curiosity;
        const seen = new Set();
        for (let i = 0; i < perType * 2 && out.length < perType; i++) {
          const h = (pick(arr, rnd) || "").replace(/\{t\}/g, t);
          if (!seen.has(h)) { seen.add(h); out.push({ type: ty, text: h }); }
        }
      });
      return out;
    }
  };
})();
