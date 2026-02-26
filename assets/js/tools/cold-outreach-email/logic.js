(function () {
  "use strict";
  const PUNCHY = ["Quick note:", "Reaching out:", "Thought you might like this:"];
  const FORMAL = ["I hope this email finds you well.", "I am writing to introduce myself."];
  const BODIES = { punchy: "I saw [X]. I think [Y]. Would love to connect. [Name]", formal: "I am interested in [role/opportunity]. My background in [X] aligns with [Y]. I would appreciate the chance to discuss. Best, [Name]" };
  const RECIPIENTS = ["recruiter", "hiring manager", "broker"];
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
  window.NSB_COLD_OUTREACH = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);
      const context = (inputs.context || "a role at your company").slice(0, 100);
      const punchyOpener = pick(PUNCHY, rnd);
      const formalOpener = pick(FORMAL, rnd);
      const punchy = punchyOpener + "\n\n" + BODIES.punchy.replace("[X]", context).replace("[Y]", "we could work together");
      const formal = formalOpener + "\n\n" + BODIES.formal.replace("[role/opportunity]", context).replace("[X]", "your industry").replace("[Y]", "your needs");
      return { punchy, formal };
    }
  };
})();
