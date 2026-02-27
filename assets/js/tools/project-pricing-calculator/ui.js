/**
 * Project Pricing Calculator - UI
 * Query params (URL sync): estimatedHours, hourlyRate, complexityMultiplier, riskBufferPercent, expenses, hoursPerWeek
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "project-pricing-calculator";
  var TOOL_NAME = "Project Pricing Calculator";
  var PARAM_KEYS = ["estimatedHours", "hourlyRate", "complexityMultiplier", "riskBufferPercent", "expenses", "hoursPerWeek"];

  function getParams() {
    var form = document.getElementById("nsb-form");
    if (!form) return {};
    var o = {};
    PARAM_KEYS.forEach(function (k) {
      var el = form.querySelector("[name=" + k + "]");
      o[k] = el ? el.value : "";
    });
    return o;
  }

  function setParams(data) {
    PARAM_KEYS.forEach(function (k) {
      var el = document.querySelector("[name=" + k + "]");
      if (el && data[k] != null) el.value = data[k];
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("nsb-form");
    var scenariosEl = document.getElementById("nsb-scenarios");
    var shareEl = document.getElementById("nsb-share-embed");
    var u = window.NSB_UTILS || {};
    var fmt = u.formatCurrency || function (n) { return "$" + Math.round(n).toLocaleString(); };

    function run() {
      var outputEl = document.getElementById("nsb-output");
      var bench = document.getElementById("nsb-benchmarks");
      if (!outputEl) return;
      try {
        var calc = window.NSB_PROJECT_PRICING;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter estimated hours and hourly rate to see results.') + '</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>Quote range:</strong> " + fmt(res.low) + " to " + fmt(res.high) + " (target " + fmt(res.target) + ")<br>" +
          "<strong>Suggested deposit (40%):</strong> " + fmt(res.deposit) + "<br>" +
          (res.weeksEstimate ? "<strong>Timeline estimate:</strong> ~" + res.weeksEstimate + " weeks" : "") +
          (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true") ? " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>" : "");
        outputEl.innerHTML = html;
        if (bench) {
          bench.innerHTML = res.riskBuffer < 15
            ? '<div class="benchmark benchmark-warn">Risk buffer under 15%: consider adding cushion.</div>'
            : '<div class="benchmark benchmark-ok">Risk buffer looks healthy.</div>';
        }
        if (window.NSB_SHARE_EMBED && shareEl) {
          try { window.NSB_SHARE_EMBED.updateParams(shareEl, { slug: SLUG, params: inputs }); } catch (e) {}
        }
        if (u.updateURLParams) u.updateURLParams(window.location.pathname, inputs, "replace");
      } catch (err) {
        outputEl.innerHTML = '<p class="benchmark benchmark-warn">Error: ' + String(err && err.message ? err.message : err) + '</p>';
        if (typeof console !== "undefined" && console.error) console.error(err);
      }
    }

    if (form) {
      form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
      form.addEventListener("input", u.debounce ? u.debounce(run, 400) : run);
    }

    if (u.decodeParams) {
      var q = u.decodeParams(window.location.search);
      var hasParams = Object.keys(q).filter(function (k) { return k !== "autorun"; }).length > 0;
      if (hasParams) { setParams(q); run(); }
    }

    try {
      if (window.NSB_SHARE_EMBED && shareEl) {
        window.NSB_SHARE_EMBED.render(shareEl, { slug: SLUG, toolName: TOOL_NAME, params: getParams() });
      }
    } catch (e) {}

    try {
      if (window.NSB_SCENARIOS && window.NSB_SCENARIOS.renderUI && scenariosEl) {
        window.NSB_SCENARIOS.renderUI(scenariosEl, {
          slug: SLUG,
          getParams: getParams,
          setParams: setParams,
          getOutputData: function (r) { return { low: r.low, target: r.target, high: r.high, deposit: r.deposit }; },
          columnsFn: function () { return ["low", "target", "high", "deposit"]; },
          calcFn: function (inp) { return window.NSB_PROJECT_PRICING && window.NSB_PROJECT_PRICING.calculate(inp); },
          run: run,
          format: fmt
        });
      }
    } catch (e) {}

    if (u.storage) {
      try {
        var r = u.storage.get("nsb_recent", []);
        u.storage.set("nsb_recent", [SLUG].concat(r.filter(function (x) { return x !== SLUG; })).slice(0, 10));
      } catch (e) {}
    }
  });
})();
