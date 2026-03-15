/**
 * NSB Tool Adapters - per-tool input read/apply helpers.
 * API: window.NSB_TOOL_ADAPTERS.getAdapter(toolSlug)
 * Each adapter: { readInputs(), applyInputs(inputs), runIfAvailable() }
 */
(function () {
  "use strict";

  var ADAPTERS = {
    "loan-debt-payoff-calculator": {
      keys: ["principal", "interestRate", "monthlyPayment", "extraPayment"],
      toolUrl: "/tools/loan-debt-payoff-calculator/",
    },
    "burn-rate-runway-calculator": {
      keys: ["cashOnHand", "monthlyRevenue", "monthlyExpenses", "revenueGrowthRate"],
      toolUrl: "/tools/burn-rate-runway-calculator/",
    },
  };

  function getForm() {
    return document.getElementById("nsb-form");
  }

  function makeAdapter(spec) {
    return {
      keys: spec.keys,
      toolUrl: spec.toolUrl,

      readInputs: function () {
        var form = getForm();
        var o = {};
        spec.keys.forEach(function (k) {
          var el = form ? form.querySelector("[name=" + k + "]") : document.querySelector("[name=" + k + "]");
          o[k] = el ? el.value : "";
        });
        return o;
      },

      applyInputs: function (inputs) {
        if (!inputs || typeof inputs !== "object") return;
        spec.keys.forEach(function (k) {
          try {
            var el = document.querySelector("form#nsb-form [name=" + k + "]") || document.querySelector("[name=" + k + "]");
            if (el && inputs[k] != null) el.value = inputs[k];
          } catch (e) {}
        });
      },

      runIfAvailable: function () {
        try {
          var form = getForm();
          if (form) {
            var submitBtn = form.querySelector("button[type=submit]");
            if (submitBtn) { submitBtn.click(); return; }
            form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
            return;
          }
        } catch (e) {}
        try {
          var inputEl = document.querySelector("[name=" + spec.keys[0] + "]");
          if (inputEl) inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (e) {}
      },
    };
  }

  function getAdapter(toolSlug) {
    var spec = ADAPTERS[toolSlug];
    if (!spec) return null;
    return makeAdapter(spec);
  }

  function getToolUrl(toolSlug) {
    var spec = ADAPTERS[toolSlug];
    return spec ? spec.toolUrl : null;
  }

  window.NSB_TOOL_ADAPTERS = {
    getAdapter: getAdapter,
    getToolUrl: getToolUrl,
  };
})();
