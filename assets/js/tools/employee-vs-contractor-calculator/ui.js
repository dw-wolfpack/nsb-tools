/**
 * Employee vs Contractor Cost Calculator - UI
 * Query params (URL sync): employeeMode, employeeSalary, employeeHourlyRate, annualHours, benefitsPercent, payrollTaxPercent, overheadPercent, contractorHourlyRate
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "employee-vs-contractor-calculator";
  var TOOL_NAME = "Employee vs Contractor Cost Calculator";
  var PARAM_KEYS = ["employeeMode", "employeeSalary", "employeeHourlyRate", "annualHours", "benefitsPercent", "payrollTaxPercent", "overheadPercent", "contractorHourlyRate"];

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
    var modeSelect = document.querySelector("[name=employeeMode]");
    var salaryGroup = document.getElementById("emp-salary-group");
    var hourlyGroup = document.getElementById("emp-hourly-group");
    var u = window.NSB_UTILS || {};
    var fmt = u.formatCurrency || function (n) { return "$" + Math.round(n).toLocaleString(); };

    function toggleMode() {
      if (!modeSelect) return;
      var isHourly = modeSelect.value === "hourly";
      if (salaryGroup) salaryGroup.style.display = isHourly ? "none" : "block";
      if (hourlyGroup) hourlyGroup.style.display = isHourly ? "block" : "none";
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
        var calc = window.NSB_EMPLOYEE_CONTRACTOR;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter employee and contractor details to see results.') + '</p>';
          if (bench) bench.innerHTML = "";
          return;
        }
        outputEl.innerHTML = "";
        if (bench) bench.innerHTML = "";
        var html = "<strong>True employee annual cost:</strong> " + fmt(res.trueEmployeeAnnualCost) + "<br>" +
          "<strong>Employee hourly equivalent:</strong> " + fmt(res.trueEmployeeHourlyEquivalent) + "/hr<br>" +
          "<strong>Contractor annual cost:</strong> " + fmt(res.contractorAnnualCost);
        if (res.breakevenHours != null) html += "<br><strong>Breakeven hours:</strong> " + Math.round(res.breakevenHours);
        if (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true")) html += " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>";
        outputEl.innerHTML = html;
        if (bench) {
          bench.innerHTML = '<div class="benchmark benchmark-ok">Rule of thumb: contractor often 1.3 to 1.8x employee equivalent.</div>';
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
            return { trueEmployeeAnnualCost: r.trueEmployeeAnnualCost, contractorAnnualCost: r.contractorAnnualCost, breakevenHours: r.breakevenHours };
          },
          columnsFn: function () { return ["trueEmployeeAnnualCost", "contractorAnnualCost", "breakevenHours"]; },
          calcFn: function (inp) { return window.NSB_EMPLOYEE_CONTRACTOR && window.NSB_EMPLOYEE_CONTRACTOR.calculate(inp); },
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
