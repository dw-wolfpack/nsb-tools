/**
 * Freelance Rate Calculator - UI
 * Query params (URL sync): desiredAnnualIncome, annualExpenses, billableHoursPerWeek, vacationWeeks, utilizationRate, bufferPercent
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "freelance-rate-calculator";
  var TOOL_NAME = "Freelance Rate Calculator";
  var PARAM_KEYS = ["desiredAnnualIncome", "annualExpenses", "billableHoursPerWeek", "vacationWeeks", "utilizationRate", "bufferPercent"];

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

  function getOutputData(r) {
    if (!r) return {};
    return {
      hourlyRate: r.hourlyRate,
      dayRate: r.dayRate,
      weeklyRate: r.weeklyRate,
      monthlyTarget: r.monthlyTarget,
      project10h: r.project10h,
      project20h: r.project20h,
      project40h: r.project40h
    };
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
        var calc = window.NSB_FREELANCE_RATE;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter desired annual income and billable hours per week to see results.') + '</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>Hourly rate:</strong> " + fmt(res.hourlyRate) + "<br>" +
          "<strong>Day rate (8h):</strong> " + fmt(res.dayRate) + "<br>" +
          "<strong>Weekly target:</strong> " + fmt(res.weeklyRate) + "<br>" +
          "<strong>Monthly target:</strong> " + fmt(res.monthlyTarget) + "<br>" +
          "<strong>Project minimums:</strong> 10h " + fmt(res.project10h) + ", 20h " + fmt(res.project20h) + ", 40h " + fmt(res.project40h) +
          (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true") ? " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>" : "");
        outputEl.innerHTML = html;
        if (bench) {
          var bHtml = "";
          if (res.utilization < 60) bHtml += '<div class="benchmark benchmark-warn">Utilization under 60%: consider raising billable hours or rate.</div>';
          if (res.buffer < 15) bHtml += '<div class="benchmark benchmark-warn">Buffer under 15%: consider adding cushion for scope creep.</div>';
          if (res.utilization >= 60 && res.buffer >= 15) bHtml += '<div class="benchmark benchmark-ok">Healthy rate range. Utilization and buffer look good.</div>';
          bench.innerHTML = bHtml;
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
          getOutputData: getOutputData,
          columnsFn: function () { return ["hourlyRate", "dayRate", "weeklyRate", "project10h", "project20h", "project40h"]; },
          calcFn: function (inp) { return window.NSB_FREELANCE_RATE && window.NSB_FREELANCE_RATE.calculate(inp); },
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
