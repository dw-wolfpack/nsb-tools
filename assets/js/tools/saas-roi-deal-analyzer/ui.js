/**
 * SaaS ROI Deal Analyzer - UI
 * Query params (URL sync): cac, arpa, grossMargin, monthlyChurn
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "saas-roi-deal-analyzer";
  var TOOL_NAME = "SaaS ROI Deal Analyzer";
  var PARAM_KEYS = ["cac", "arpa", "grossMargin", "monthlyChurn"];

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
    var pct = u.formatPercent || function (n) { return (typeof n === "number" ? n.toFixed(1) : n) + "%"; };

    function run() {
      var outputEl = document.getElementById("nsb-output");
      var sensEl = document.getElementById("nsb-sensitivity");
      var bench = document.getElementById("nsb-benchmarks");
      if (!outputEl) return;
      try {
        var calc = window.NSB_SAAS_ROI;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (sensEl) sensEl.innerHTML = "";
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter CAC, ARPA, and monthly churn rate to see results.') + '</p>';
          if (sensEl) sensEl.innerHTML = "";
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (sensEl) sensEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>Lifetime months:</strong> " + res.lifetimeMonths.toFixed(1) + "<br>" +
          "<strong>LTV:</strong> " + fmt(res.ltv) + "<br>" +
          "<strong>CAC payback months:</strong> " + (res.paybackMonths != null ? res.paybackMonths.toFixed(1) : "-") + "<br>" +
          "<strong>ROI:</strong> " + (res.roi != null ? pct(res.roi) : "-") +
          (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true") ? " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>" : "");
        outputEl.innerHTML = html;
        if (sensEl) {
          var c = parseFloat(inputs.cac) || 0;
          var a = parseFloat(inputs.arpa) || 0;
          var ch = parseFloat(inputs.monthlyChurn) || 5;
          var m = parseFloat(inputs.grossMargin) || 80;
          var r1 = calc.calculate({ cac: c * 1.1, arpa: a, grossMargin: m, monthlyChurn: ch });
          var r2 = calc.calculate({ cac: c, arpa: a * 1.1, grossMargin: m, monthlyChurn: ch });
          var r3 = calc.calculate({ cac: c, arpa: a, grossMargin: m, monthlyChurn: ch * 0.9 });
          var sHtml = "<h3>Sensitivity (+10% CAC, +10% ARPA, -10% churn)</h3><ul>";
          sHtml += "<li>CAC +10%: payback " + (r1 && r1.paybackMonths != null ? r1.paybackMonths.toFixed(1) : "-") + " mo</li>";
          sHtml += "<li>ARPA +10%: payback " + (r2 && r2.paybackMonths != null ? r2.paybackMonths.toFixed(1) : "-") + " mo</li>";
          sHtml += "<li>Churn -10%: payback " + (r3 && r3.paybackMonths != null ? r3.paybackMonths.toFixed(1) : "-") + " mo</li></ul>";
          sensEl.innerHTML = sHtml;
        }
        if (bench) {
          var bHtml = "";
          if (res.paybackMonths != null) {
            if (res.paybackMonths <= 3) bHtml = '<div class="benchmark benchmark-ok">Payback under 3 months. Excellent unit economics.</div>';
            else if (res.paybackMonths <= 6) bHtml = '<div class="benchmark benchmark-warn">Payback 3 to 6 months. Acceptable for most SaaS.</div>';
            else bHtml = '<div class="benchmark benchmark-error">Payback over 6 months. Review CAC, raise ARPA, or reduce churn.</div>';
          }
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
          getOutputData: function (r) { return { ltv: r.ltv, paybackMonths: r.paybackMonths, roi: r.roi }; },
          columnsFn: function () { return ["ltv", "paybackMonths", "roi"]; },
          calcFn: function (inp) { return window.NSB_SAAS_ROI && window.NSB_SAAS_ROI.calculate(inp); },
          run: run,
          format: function (v) { return typeof v === "number" ? (v < 100 ? v.toFixed(1) : fmt(v)) : String(v || ""); }
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
