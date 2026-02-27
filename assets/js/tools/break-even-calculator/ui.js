/**
 * Break-even Calculator - UI
 * Query params (URL sync): mode, fixedCostsPerMonth, variableCostPerUnit, pricePerUnit, grossMargin, arpa (mode=saas for SaaS)
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "break-even-calculator";
  var TOOL_NAME = "Break-even Calculator";
  var PARAM_KEYS = ["mode", "fixedCostsPerMonth", "variableCostPerUnit", "pricePerUnit", "grossMargin", "arpa"];

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
    var modeSelect = document.querySelector("[name=mode]");
    var serviceEcom = document.getElementById("mode-service-ecom");
    var serviceEcom2 = document.getElementById("mode-service-ecom-2");
    var serviceEcom3 = document.getElementById("mode-service-ecom-3");
    var saasEl = document.getElementById("mode-saas");
    var saasEl2 = document.getElementById("mode-saas-2");
    var u = window.NSB_UTILS || {};
    var fmt = u.formatCurrency || function (n) { return "$" + Math.round(n).toLocaleString(); };
    var pct = u.formatPercent || function (n) { return (typeof n === "number" ? n.toFixed(1) : n) + "%"; };

    function toggleMode() {
      if (!modeSelect) return;
      var isSaas = modeSelect.value === "saas";
      [serviceEcom, serviceEcom2, serviceEcom3].forEach(function (el) { if (el) el.style.display = isSaas ? "none" : "block"; });
      if (saasEl) saasEl.style.display = isSaas ? "block" : "none";
      if (saasEl2) saasEl2.style.display = isSaas ? "block" : "none";
    }

    if (modeSelect) {
      modeSelect.addEventListener("change", toggleMode);
      toggleMode();
    }

    function run() {
      var outputEl = document.getElementById("nsb-output");
      var bench = document.getElementById("nsb-benchmarks");
      if (!outputEl) return;
      try {
        var calc = window.NSB_BREAKEVEN;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Enter fixed costs and price per unit (or ARPA for SaaS) to see results.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        if (res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-error">' + res.error + '</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "";
        if (res.mode === "saas") {
          html = "<strong>Customers to break even:</strong> " + res.customersToBreakEven + "<br>" +
            "<strong>MRR to break even:</strong> " + fmt(res.mrrToBreakEven);
        } else {
          html = "<strong>Units to break even:</strong> " + res.unitsToBreakEven + "<br>" +
            "<strong>Revenue to break even:</strong> " + fmt(res.revenueToBreakEven) + "<br>" +
            "<strong>Contribution margin:</strong> " + pct(res.contributionMargin != null ? res.contributionMargin : res.contributionPerUnit);
        }
        if (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true")) html += " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>";
        outputEl.innerHTML = html;
        if (bench) {
          var bHtml = "";
          if (res.contributionMargin != null && res.contributionMargin < 40) {
            bHtml = '<div class="benchmark benchmark-warn">Margin under 40%: consider raising price or lowering variable cost.</div>';
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
      if (hasParams) { setParams(q); toggleMode(); run(); }
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
            var o = {};
            if (r.unitsToBreakEven != null) o.unitsToBreakEven = r.unitsToBreakEven;
            if (r.revenueToBreakEven != null) o.revenueToBreakEven = r.revenueToBreakEven;
            if (r.customersToBreakEven != null) o.customersToBreakEven = r.customersToBreakEven;
            if (r.mrrToBreakEven != null) o.mrrToBreakEven = r.mrrToBreakEven;
            return o;
          },
          columnsFn: function () { return ["unitsToBreakEven", "revenueToBreakEven", "customersToBreakEven", "mrrToBreakEven"]; },
          calcFn: function (inp) { return window.NSB_BREAKEVEN && window.NSB_BREAKEVEN.calculate(inp); },
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
