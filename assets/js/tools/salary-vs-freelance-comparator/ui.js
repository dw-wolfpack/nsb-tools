/**
 * Salary vs Freelance Comparator - UI
 * Query params (URL sync): salaryW2, benefitsValue, taxesPercent, freelanceHourlyRate, utilization, expenses
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "salary-vs-freelance-comparator";
  var TOOL_NAME = "Salary vs Freelance Comparator";
  var PARAM_KEYS = ["salaryW2", "benefitsValue", "taxesPercent", "freelanceHourlyRate", "utilization", "expenses"];

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
        var calc = window.NSB_SALARY_FREELANCE;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter your W2 salary to see results.') + '</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>Effective W2 hourly:</strong> " + fmt(res.effectiveW2Hourly) + "<br>" +
          "<strong>Freelance net annual:</strong> " + fmt(res.freelanceNetAnnual) + "<br>" +
          "<strong>Freelance net monthly:</strong> " + fmt(res.freelanceNetMonthly) + "<br>" +
          "<strong>Breakeven hourly rate:</strong> " + fmt(res.breakevenHourly) +
          (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true") ? " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>" : "");
        outputEl.innerHTML = html;
        if (bench) {
          bench.innerHTML = '<div class="benchmark benchmark-ok">Adjust rate, utilization, and expenses to model different scenarios.</div>';
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
          getOutputData: function (r) {
            return { effectiveW2Hourly: r.effectiveW2Hourly, freelanceNetAnnual: r.freelanceNetAnnual, breakevenHourly: r.breakevenHourly };
          },
          columnsFn: function () { return ["effectiveW2Hourly", "freelanceNetAnnual", "breakevenHourly"]; },
          calcFn: function (inp) { return window.NSB_SALARY_FREELANCE && window.NSB_SALARY_FREELANCE.calculate(inp); },
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
