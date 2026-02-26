(function () {
  "use strict";
  const OPENERS = ["Today's post is about", "A quick reminder", "Here's something I've been thinking about", "Real talk:"];
  const BODIES = ["{topic} matters more than you think.", "When it comes to {topic}, small shifts make a big difference.", "If you're struggling with {topic}, try this."];
  const CTAS = ["Drop a comment below.", "What would you add?", "Save this for later.", "Tag someone who needs this.", "Follow for more."];
  const COMMENT_PROMPTS = ["What's your go-to tip?", "Have you tried this?", "What worked for you?"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_CAPTION = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const topic = (inputs.topic || "your niche").slice(0, 50);
      const platform = (inputs.platform || "instagram").toLowerCase();
      const t = topic || "this";
      const opener = pick(OPENERS, rnd);
      const body = pick(BODIES, rnd).replace(/\{topic\}/g, t);
      const cta = pick(CTAS, rnd);
      const comment = pick(COMMENT_PROMPTS, rnd);
      return {
        caption: opener + " " + body + "\n\n" + cta,
        commentPrompt: comment
      };
    }
  };
})();
