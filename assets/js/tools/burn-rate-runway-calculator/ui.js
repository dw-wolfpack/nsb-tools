/**
 * Burn Rate / Runway Calculator - UI
 * Query params (URL sync): cashOnHand, monthlyRevenue, monthlyExpenses, revenueGrowthRate
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "burn-rate-runway-calculator";
  var TOOL_NAME = "Burn Rate / Runway Calculator";
  var PARAM_KEYS = ["cashOnHand", "monthlyRevenue", "monthlyExpenses", "revenueGrowthRate"];

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
      var projEl = document.getElementById("nsb-projection");
      var bench = document.getElementById("nsb-benchmarks");
      if (!outputEl) return;
      try {
        var calc = window.NSB_BURN_RATE;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (projEl) projEl.innerHTML = "";
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter cash on hand and monthly expenses to see results.') + '</p>';
          if (projEl) projEl.innerHTML = "";
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (projEl) projEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>Net burn:</strong> " + fmt(res.netBurn) + "/month<br>" +
          "<strong>Runway:</strong> " + (res.runwayLabel ? res.runwayLabel : (res.runwayMonths != null ? res.runwayMonths.toFixed(1) + " months" : "Infinite (not burning)")) +
          (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true") ? " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>" : "");
        outputEl.innerHTML = html;
        if (projEl && res.projection && res.projection.length) {
          var tbl = '<table class="compare-table"><thead><tr><th>Month</th><th>Cash</th><th>Revenue</th><th>Expenses</th></tr></thead><tbody>';
          res.projection.forEach(function (row) {
            tbl += "<tr><td>" + row.month + "</td><td>" + fmt(row.cash) + "</td><td>" + fmt(row.revenue) + "</td><td>" + fmt(row.expenses) + "</td></tr>";
          });
          tbl += "</tbody></table>";
          projEl.innerHTML = tbl;
        }
        if (bench) {
          var bHtml = "";
          if (res.runwayMonths != null) {
            if (res.runwayMonths < 6) bHtml = '<div class="benchmark benchmark-error">Runway under 6 months. Raise revenue or cut costs urgently.</div>';
            else if (res.runwayMonths < 12) bHtml = '<div class="benchmark benchmark-warn">Runway 6 to 12 months. Keep a close eye on burn.</div>';
            else bHtml = '<div class="benchmark benchmark-ok">Runway over 12 months.</div>';
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
          getOutputData: function (r) { return { netBurn: r.netBurn, runwayMonths: r.runwayMonths }; },
          columnsFn: function () { return ["netBurn", "runwayMonths"]; },
          calcFn: function (inp) { return window.NSB_BURN_RATE && window.NSB_BURN_RATE.calculate(inp); },
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
