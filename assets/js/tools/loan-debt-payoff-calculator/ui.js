/**
 * Loan Debt Payoff Calculator - UI
 * Query params (URL sync): principal, interestRate, monthlyPayment, extraPayment
 * Prefill + autorun on load when at least one param is present.
 */
(function () {
  "use strict";

  var SLUG = "loan-debt-payoff-calculator";
  var TOOL_NAME = "Loan Debt Payoff Calculator";
  var PARAM_KEYS = ["principal", "interestRate", "monthlyPayment", "extraPayment"];

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
    function moneyOrDash(v) { return Number.isFinite(v) ? fmt(v) : "—"; }
    var lastCopyable = "";

    function run() {
      var outputEl = document.getElementById("nsb-output");
      var amortEl = document.getElementById("nsb-amort");
      var bench = document.getElementById("nsb-benchmarks");
      if (!outputEl) return;
      outputEl.innerHTML = "";
      if (amortEl) amortEl.innerHTML = "";
      if (bench) bench.innerHTML = "";
      try {
        var calc = window.NSB_LOAN_PAYOFF;
        if (!calc || typeof calc.calculate !== "function") {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">Calculator script did not load. Refresh the page.</p>';
          return;
        }
        var inputs = getParams();
        var res = calc.calculate(inputs);
        if (!res || res.error) {
          outputEl.innerHTML = '<p class="benchmark benchmark-warn">' + (res && res.error ? res.error : 'Enter principal balance and monthly payment to see results.') + '</p>';
          lastCopyable = "";
          return;
        }
        lastCopyable = "Months to payoff: " + res.monthsToPayoff + "\nTotal interest: " + fmt(res.totalInterest);
        if (res.interestSavings != null && res.interestSavings > 0) lastCopyable += "\nInterest saved with extra payment: " + fmt(res.interestSavings);
        if (res.schedule && res.schedule.length) {
          var maxRows = 10;
          if (res.schedule.length <= maxRows) {
            lastCopyable += "\n\nSchedule:\nMonth\tPayment\tPrincipal\tInterest\tBalance";
            res.schedule.forEach(function (r) {
              var pPaid = r.principalPaid != null ? r.principalPaid : r.principal;
              var iPaid = r.interestPaid != null ? r.interestPaid : r.interest;
              var bal = r.endingBalance != null ? r.endingBalance : r.balance;
              lastCopyable += "\n" + r.month + "\t" + moneyOrDash(r.payment) + "\t" + moneyOrDash(pPaid) + "\t" + moneyOrDash(iPaid) + "\t" + moneyOrDash(bal);
            });
          } else {
            lastCopyable += "\n\nSchedule (first " + maxRows + " months):\nMonth\tPayment\tPrincipal\tInterest\tBalance";
            for (var i = 0; i < maxRows && i < res.schedule.length; i++) {
              var r = res.schedule[i];
              var pPaid = r.principalPaid != null ? r.principalPaid : r.principal;
              var iPaid = r.interestPaid != null ? r.interestPaid : r.interest;
              var bal = r.endingBalance != null ? r.endingBalance : r.balance;
              lastCopyable += "\n" + r.month + "\t" + moneyOrDash(r.payment) + "\t" + moneyOrDash(pPaid) + "\t" + moneyOrDash(iPaid) + "\t" + moneyOrDash(bal);
            }
            lastCopyable += "\n... Schedule shown on page.";
          }
        }
        var html = "<strong>Months to payoff:</strong> " + res.monthsToPayoff + "<br>" +
          "<strong>Total interest:</strong> " + fmt(res.totalInterest);
        if (res.interestSavings != null && res.interestSavings > 0) html += "<br><strong>Interest saved with extra payment:</strong> " + fmt(res.interestSavings);
        if (window.NSB_DEBUG_HIDDEN || (typeof localStorage !== "undefined" && localStorage.getItem("nsb_debug") === "true")) html += " <span class=\"small muted\">Rendered at " + new Date().toLocaleTimeString() + "</span>";
        outputEl.innerHTML = html;
        if (amortEl) {
          if (res.schedule && res.schedule.length) {
            var tbl = '<table class="compare-table"><thead><tr><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>';
            res.schedule.forEach(function (row) {
              var pay = row.payment;
              var pPaid = row.principalPaid != null ? row.principalPaid : row.principal;
              var iPaid = row.interestPaid != null ? row.interestPaid : row.interest;
              var bal = row.endingBalance != null ? row.endingBalance : row.balance;
              tbl += "<tr><td>" + row.month + "</td><td>" + moneyOrDash(pay) + "</td><td>" + moneyOrDash(pPaid) + "</td><td>" + moneyOrDash(iPaid) + "</td><td>" + moneyOrDash(bal) + "</td></tr>";
            });
            tbl += "</tbody></table>";
            amortEl.innerHTML = tbl;
          } else {
            amortEl.innerHTML = "";
          }
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

    var copyBtn = document.getElementById("nsb-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (lastCopyable && u.copyToClipboard) {
          u.copyToClipboard(lastCopyable).then(function (ok) {
            if (ok && window.NSB_TOAST) window.NSB_TOAST.show("Copied");
          });
        }
      });
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
          getOutputData: function (r) { return { monthsToPayoff: r.monthsToPayoff, totalInterest: r.totalInterest }; },
          columnsFn: function () { return ["monthsToPayoff", "totalInterest"]; },
          calcFn: function (inp) { return window.NSB_LOAN_PAYOFF && window.NSB_LOAN_PAYOFF.calculate(inp); },
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
