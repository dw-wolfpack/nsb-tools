(function () {
  "use strict";
  const OPENERS = ["Quick thought:", "Hot take:", "Story time:", "Here's the thing:", "Real talk:"];
  const SHORT = ["{stance} on {topic}. That's it.", "{topic} in one sentence: {stance}.", "My take: {stance}."];
  const MEDIUM = ["{stance}\n\nWhy? Because {topic}.\n\nWhat I've seen: most people overlook this. Don't.", "{topic} is overcomplicated.\n\n{stance}\n\nKeep it simple."];
  const LONG = ["{opener}\n\n{stance}\n\nWhen I think about {topic}, a few things stand out:\n\n1. First point\n2. Second point\n3. Third point\n\nBottom line: {stance}"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_LINKEDIN = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const stance = (inputs.stance || "your perspective").slice(0, 100);
      const topic = (inputs.topic || "your topic").slice(0, 80);
      const len = inputs.length || "medium";
      const opener = pick(OPENERS, rnd);
      let body = "";
      if (len === "short") body = pick(SHORT, rnd).replace(/\{stance\}/g, stance).replace(/\{topic\}/g, topic);
      else if (len === "long") body = pick(LONG, rnd).replace(/\{opener\}/g, opener).replace(/\{stance\}/g, stance).replace(/\{topic\}/g, topic);
      else body = pick(MEDIUM, rnd).replace(/\{stance\}/g, stance).replace(/\{topic\}/g, topic);
      return { opener, body, full: (len !== "short" ? opener + "\n\n" : "") + body };
    }
  };
})();
