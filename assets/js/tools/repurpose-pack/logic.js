(function () {
  "use strict";
  function extractPhrases(text) {
    const words = text.split(/\s+/).filter(w => w.length > 4);
    return [...new Set(words)].slice(0, 10);
  }
  const HOOK_TEMPLATES = ["What they don't tell you about {x}", "The secret to {x}", "Why {x} matters"];
  const SCRIPT_TEMPLATES = ["Hook: {x}\nBody: Expand on this point\nCTA: What to do next"];
  const CAPTION_TEMPLATES = ["{x}. Full breakdown below.", "Quick tip: {x}"];
  const VISUAL_TEMPLATES = ["Before/after showing {x}", "List graphic: 3-5 key points", "Quote card: key phrase"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_REPURPOSE = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const text = (inputs.text || "").trim().slice(0, 2000);
      const phrases = extractPhrases(text);
      const x = phrases[0] || "your topic";
      const hooks = HOOK_TEMPLATES.slice(0, 2).map(t => t.replace("{x}", x));
      const script = pick(SCRIPT_TEMPLATES, rnd).replace("{x}", x);
      const captions = CAPTION_TEMPLATES.slice(0, 2).map(t => t.replace("{x}", x));
      const visuals = VISUAL_TEMPLATES.slice(0, 3);
      return { hooks, script, captions, visuals };
    }
  };
})();
