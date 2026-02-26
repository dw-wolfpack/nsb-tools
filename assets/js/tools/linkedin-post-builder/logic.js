(function () {
  "use strict";

  // ---- Phrase banks (curated, no cringe) ----
  const OPENERS = {
    clean: ["Quick thought:", "Here's my take:", "A pattern I keep seeing:", "A hard truth:", "Something worth saying:"],
    edgy: ["Hot take:", "Real talk:", "Unpopular opinion:", "Let's stop pretending:", "Most people won't like this:"],
    professional: ["Observation:", "Recommendation:", "In practice:", "Lesson learned:", "What I'd do differently:"],
    funny: ["Confession:", "Plot twist:", "I didn't expect this either:", "Small rant:", "That's the post."]
  };

  const CRINGE = [
    "in today's world", "game changer", "crush it", "hustle", "synergy",
    "rockstar", "10x", "move the needle", "thought leader", "low-hanging fruit",
    "circle back", "leverage", "deep dive", "best practice", "at the end of the day",
    "reach out", "ping me", "pick my brain", "bandwidth", "touch base"
  ];

  const CTAS = {
    soft: ["Curious if you've seen the same.", "What's your experience?", "Agree or disagree?"],
    ask: ["What would you change?", "Where do you think I'm wrong?", "What's the counterexample?"],
    direct: ["If you're dealing with this, fix it this week.", "Try this once and see what happens.", "Steal this and report back."],
    funny: ["That's the post.", "No notes.", "Thoughts?"]
  };

  const EXAMPLE_LINES = [
    "Example: teams spend weeks debating tooling while customers churn quietly.",
    "Example: the same meeting happens every Monday and nothing changes.",
    "Example: a simple spreadsheet outlasts the fancy dashboard every time.",
    "Example: the loudest voice in the room is rarely the one shipping.",
    "Example: we hired for culture fit and got groupthink instead."
  ];

  const BECAUSE_LINES = [
    "Because the boring stuff compounds.",
    "Because most teams optimize for optics, not outcomes.",
    "Because execution beats strategy every time.",
    "Because the feedback loop is too slow.",
    "Because we confuse motion with progress."
  ];

  const COMPOUND_FIXES = {
    "dooms day": "doomsday", "doom's day": "doomsday"
  };

  // ---- Templates (short always has opener + stance + supporting line + CTA) ----
  const TEMPLATES = {
    short: [
      "{opener}\n\n{stance_line}\n\n{supporting_line}\n\n{cta}",
      "{opener}\n\nMost people miss this about {topic_phrase}:\n{stance_line}\n\n{supporting_line}\n\n{cta}",
      "{opener}\n\n{stance_line}\n\n{supporting_line}\n\n{cta}"
    ],
    medium: [
      "{opener}\n\n{stance_line}\n\nHere's why:\n- {reason1}\n- {reason2}\n\n{example_line}\n\nWhat I'd do:\n{action}\n\n{cta}",
      "{opener}\n\n{topic_phrase} gets overcomplicated.\n\n{stance_line}\n\nA simple filter:\n{filter}\n\n{example_line}\n\n{cta}",
      "{opener}\n\nI used to think {old_belief}.\n\nThen I watched {evidence}.\n\nNow my take is simple:\n{stance_line}\n\n{cta}"
    ],
    long: [
      "{opener}\n\n{stance_line}\n\nIf you've been around {topic_phrase} long enough, you've seen two worlds:\n\n1) {world1}\n2) {world2}\n\nThe difference is rarely talent.\nIt's usually {root_cause}.\n\nWhat works:\n- {reason1}\n- {reason2}\n- {reason3}\n\n{example_line}\n\nWhat I'd do this week:\n{action}\n\n{cta}",
      "{opener}\n\n{stance_line}\n\nThree things people don't want to admit about {topic_phrase}:\n\n1) {reason1}\n2) {reason2}\n3) {reason3}\n\n{example_line}\n\nIf you want a practical starting point:\n{action}\n\n{cta}"
    ]
  };

  // ---- Helpers ----
  function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }

  function sanitizeLine(s, maxLen) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLen || 140);
  }

  function normalizeTopic(topic) {
    let t = String(topic || "").replace(/\s+/g, " ").trim().toLowerCase();
    Object.keys(COMPOUND_FIXES).forEach(function (k) {
      const re = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      t = t.replace(re, COMPOUND_FIXES[k]);
    });
    return t.trim();
  }

  function topicPhrase(topic, audience) {
    const t = normalizeTopic(topic) || "your topic";
    const a = sanitizeLine(audience || "", 60).toLowerCase();
    if (!a) {
      if (/^(productivity|meetings|remote|async|ai|leadership|culture|hiring|execution|strategy)$/i.test(t)) {
        return t + " in practice";
      }
      return t;
    }
    const audienceNorm = a.replace(/\s+/g, " ");
    if (/narrative|doom|takeover|end|future/i.test(t)) {
      return t + " narratives in " + audienceNorm;
    }
    if (/\bleaders\b/.test(audienceNorm)) {
      return t + " in " + audienceNorm.replace(/\bleaders\b/, "leadership").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    if (/creator|founder|manager|engineer/i.test(audienceNorm)) {
      return t + " in " + audienceNorm.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }
    return t + " for " + audienceNorm;
  }

  const ABSOLUTE_SOFTENERS = {
    "will take over": [
      "will take over the parts that matter",
      "will take over faster than most teams are prepared for",
      "will take over by quietly changing workflows"
    ],
    "always": [
      "usually",
      "more often than not",
      "in most cases"
    ],
    "never": [
      "rarely",
      "seldom",
      "almost never"
    ],
    "everyone": [
      "most teams",
      "a lot of people",
      "many orgs"
    ],
    "everything changes": [
      "the parts that matter change",
      "workflows shift faster than we adapt",
      "the bottleneck moves"
    ]
  };

  function softenAbsoluteStance(s, tone, style, rnd) {
    const lower = s.toLowerCase();
    let out = s;
    const isEdgyContrarian = (tone === "edgy" || style === "contrarian");

    if (/will take over/i.test(out)) {
      const soft = pick(ABSOLUTE_SOFTENERS["will take over"], rnd);
      out = out.replace(/will take over[^.!?]*/i, soft);
    }
    if (/\balways\b/i.test(out) && (isEdgyContrarian || /always.*never|never.*always/i.test(out))) {
      out = out.replace(/\balways\b/gi, pick(ABSOLUTE_SOFTENERS["always"], rnd));
    }
    if (/\bnever\b/i.test(out) && isEdgyContrarian) {
      out = out.replace(/\bnever\b/gi, pick(ABSOLUTE_SOFTENERS["never"], rnd));
    }
    if (/\beveryone\b/i.test(out) && isEdgyContrarian) {
      out = out.replace(/\beveryone\b/gi, pick(ABSOLUTE_SOFTENERS["everyone"], rnd));
    }
    if (/everything changes/i.test(out)) {
      out = out.replace(/everything changes[^.!?]*/gi, pick(ABSOLUTE_SOFTENERS["everything changes"], rnd));
    }
    return out.trim();
  }

  function expandStanceLine(stance, style, tone, rnd) {
    let s = sanitizeLine(stance, 120);
    if (!s) return "Here's my take.";
    const lower = s.toLowerCase();
    const isShort = s.split(/\s+/).length <= 8;
    const isAbsolute = /will take over|always|never|everything changes|everyone/i.test(s);

    if (isAbsolute) {
      s = softenAbsoluteStance(s, tone, style, rnd);
    }

    if (style === "contrarian") {
      if (!/[.!?]$/.test(s)) return s + ".";
      return s;
    }

    if (isShort && isAbsolute) {
      const nuance = pick([
        "Not because of hype, but because of how we're choosing to use it.",
        "Here's the nuance: execution beats vision every time.",
        "The real question is what we optimize for."
      ], rnd);
      return s + " " + nuance;
    }
    if (isShort && s.length < 60) {
      const sharpen = pick([
        "The real lever is usually simpler than we admit.",
        "What most people miss: the boring stuff matters more."
      ], rnd);
      return s + " " + sharpen;
    }
    if (style === "agree" && !/[.!?]$/.test(s)) return s + ".";
    return s;
  }

  function scoreCandidate(text, stanceLine) {
    const lower = text.toLowerCase();
    let score = 0;

    if (text.includes("\n\n")) score += 2;
    if (text.includes("- ")) score += 2;
    if (/\n1\)/.test(text) || /\n1\./.test(text)) score += 2;

    CRINGE.forEach(function (p) { if (lower.includes(p)) score -= 3; });

    const len = text.length;
    if (len < 200) score -= 2;
    if (len > 2800) score -= 3;

    if (/\d/.test(text)) score += 1;
    if (/(week|month|today|ship|deploy|test|budget|customer|deal)/i.test(text)) score += 1;

    const words = lower.split(/\W+/).filter(Boolean);
    const unique = new Set(words);
    const uniqRatio = unique.size / Math.max(words.length, 1);
    if (uniqRatio < 0.55) score -= 2;

    if (stanceLine) {
      const sl = stanceLine.toLowerCase();
      const occurrences = (lower.match(new RegExp(sl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
      if (occurrences > 1) score -= 3;
    }

    if (text.match(/"strategy"[^.]*"strategy"/i) || (text.match(/strategy/gi) || []).length > 2) score -= 2;
    if (/[A-Z][a-z]* [A-Z][a-z]* [A-Z]/.test(text) || /\b[A-Z][a-z]*\s+[A-Z][a-z]*\s+[A-Z]/.test(text)) score -= 1;

    return score;
  }

  function formatForLinkedIn(text, maxLen) {
    const maxLine = 100;
    const lines = text.split("\n");
    const out = [];
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.length <= maxLine) {
        out.push(line);
        continue;
      }
      const parts = line.split(/(?<=[.!?])\s+/);
      let current = "";
      for (let j = 0; j < parts.length; j++) {
        const p = parts[j];
        if (current.length + p.length + 1 <= maxLine) {
          current = current ? current + " " + p : p;
        } else {
          if (current) out.push(current);
          current = p;
        }
      }
      if (current) out.push(current);
    }
    let result = out.join("\n\n").trim();
    if (maxLen && result.length > maxLen) {
      result = result.slice(0, maxLen - 20) + "\n\n(truncated)";
    }
    return result;
  }

  function fillTemplate(tpl, ctx) {
    return tpl.replace(/\{(\w+)\}/g, function (_, k) { return ctx[k] ?? ""; });
  }

  function normalizeWhitespace(text) {
    return text
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(function (line) { return line.replace(/\s+$/, ""); })
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // ---- Public API ----
  window.NSB_LINKEDIN = {
    generate(inputs, seed) {
      const rnd = window.NSB_UTILS.seededPRNG(seed || 12345);

      const topic = sanitizeLine(inputs.topic || "your topic", 80);
      const stance = sanitizeLine(inputs.stance || "your perspective", 120);
      const audience = sanitizeLine(inputs.audience || "", 60);
      const stanceStyle = (inputs.stanceStyle || "").toLowerCase();
      const tone = (inputs.tone || "clean").toLowerCase();
      const len = (inputs.length || "medium").toLowerCase();

      const openerPool = OPENERS[tone] || (tone.includes("pro") ? OPENERS.professional : OPENERS.clean);
      const opener = pick(openerPool, rnd);

      const ctaKey = tone === "funny" ? "funny" : tone === "edgy" ? "direct" : tone === "professional" ? "soft" : "ask";
      const cta = pick(CTAS[ctaKey], rnd);

      const topic_phrase = topicPhrase(topic, audience);
      const stance_line = expandStanceLine(stance, stanceStyle, tone, rnd);
      const example_line = pick(EXAMPLE_LINES, rnd);
      const supporting_line = rnd() < 0.5 ? pick(BECAUSE_LINES, rnd) : pick(EXAMPLE_LINES, rnd);

      const ctx = {
        opener,
        topic_phrase,
        stance_line,
        supporting_line,
        cta,
        example_line,
        reason1: pick([
          "People optimize for looking smart instead of shipping something useful.",
          "We confuse motion with progress.",
          "Most wins come from boring consistency, not heroic bursts."
        ], rnd),
        reason2: pick([
          "The feedback loop is too slow, so bad ideas survive for months.",
          "Ownership is fuzzy, so nothing actually gets finished.",
          "We don't measure outcomes, so opinions become the product."
        ], rnd),
        reason3: pick([
          "The easiest fix is usually process, not tools.",
          "Clarity beats intensity every time.",
          "Constraints are a feature if you use them."
        ], rnd),
        action: pick([
          "Pick one metric that matters. Cut everything else for 7 days.",
          "Write the smallest version, ship it, then iterate with real feedback.",
          "Define the next action in one sentence, then do it today."
        ], rnd),
        filter: pick([
          "If it doesn't reduce risk or increase velocity, it's noise.",
          "If you can't explain it in 2 lines, you don't understand it yet.",
          "If you wouldn't pay for it, don't build it."
        ], rnd),
        old_belief: pick([
          "more tools would solve it",
          "more meetings would align the team",
          "a better plan would fix execution"
        ], rnd),
        evidence: pick([
          "teams ship faster with fewer options",
          "the same issues repeat even with new frameworks",
          "simple systems beat complex ones under pressure"
        ], rnd),
        world1: pick([
          "Everyone debates. Nothing ships.",
          "Plans are perfect. Outcomes are mediocre.",
          "Busy is the status symbol."
        ], rnd),
        world2: pick([
          "Small bets ship weekly.",
          "The best idea wins because it gets tested.",
          "Momentum makes everyone smarter."
        ], rnd),
        root_cause: pick(["clarity", "ownership", "feedback loops", "scope discipline"], rnd)
      };

      const bucket = TEMPLATES[len] || TEMPLATES.medium;
      const maxLenByLen = { short: 900, medium: 1800, long: 2600 };
      const maxLen = maxLenByLen[len] || 1800;

      const candidates = [];
      const seen = new Set();
      for (let i = 0; i < 8; i++) {
        const tpl = pick(bucket, rnd);
        let text = fillTemplate(tpl, ctx).trim();
        if (stanceStyle === "contrarian" && !text.toLowerCase().includes("unpopular")) {
          text = text.replace(ctx.opener, pick(OPENERS.edgy, rnd));
        }
        text = formatForLinkedIn(text.trim(), maxLen);
        if (seen.has(text)) continue;
        seen.add(text);
        candidates.push(text);
      }

      let pool = candidates;
      if (pool.length < 2) {
        for (let i = 0; pool.length < 4 && i < 20; i++) {
          const tpl = pick(bucket, rnd);
          let text = fillTemplate(tpl, ctx).trim();
          if (stanceStyle === "contrarian") text = text.replace(ctx.opener, pick(OPENERS.edgy, rnd));
          text = formatForLinkedIn(text.trim(), maxLen);
          if (!seen.has(text)) { seen.add(text); pool = pool.concat([text]); }
        }
      }

      pool.sort(function (a, b) { return scoreCandidate(b, stance_line) - scoreCandidate(a, stance_line); });
      let best = pool[0] || ctx.opener + "\n\n" + ctx.stance_line + "\n\n" + ctx.supporting_line + "\n\n" + ctx.cta;
      best = normalizeWhitespace(best);

      return { opener: ctx.opener, body: best, full: best };
    }
  };
})();

/*
  Example input/output sanity checks:

  SHORT: topic="Meetings", stance="meetings drain focus", length="short"
    -> Must include: opener + stance_line + supporting_line (Because... or Example:) + CTA
    -> No sparse output (opener + stance + CTA only)

  MEDIUM: topic="Remote work", stance="remote work boosts productivity", length="medium"
    -> topic_phrase: "remote work in practice"
    -> Includes example_line, reasons, action
    -> Whitespace normalized (no triple newlines, no trailing spaces)

  LONG: topic="AI", stance="AI will take over the world", stanceStyle="contrarian", tone="edgy"
    -> stance_line softened: "AI will take over the parts that matter" or similar (not "the world")
    -> Full structure: opener, stance, two worlds, reasons, example, action, CTA
*/
