(function () {
  "use strict";
  const HOWTO = ["How to {topic} in {n} Steps", "How to {topic} (Complete Guide)", "How I {topic}"];
  const LIST = ["{n} Ways to {topic}", "Top {n} {topic} Tips", "{n} {topic} Ideas"];
  const CONTRARIAN = ["Stop {topic}. Start This.", "Why {topic} Is Overrated", "The {topic} Myth"];
  const STORY = ["What {topic} Taught Me", "My {topic} Journey", "The Day I Discovered {topic}"];
  const STYLES = { howto: HOWTO, list: LIST, contrarian: CONTRARIAN, story: STORY };
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_HEADLINE = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const topic = (inputs.topic || "your topic").slice(0, 50);
      const n = Math.floor(rnd() * 5) + 3;
      const t = topic || "this";
      const styles = inputs.styles ? inputs.styles.split(",").map(s => s.trim()).filter(Boolean) : ["howto", "list", "contrarian", "story"];
      const out = [];
      styles.forEach(style => {
        const arr = STYLES[style] || HOWTO;
        const template = pick(arr, rnd);
        out.push({ style, text: template.replace(/\{topic\}/g, t).replace(/\{n\}/g, n) });
      });
      return out;
    }
  };
})();
