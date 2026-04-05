/**
 * NSB Tools - Central Pro copy (benefit-led, single source of truth).
 * API: window.NSB_PRO_COPY
 */
(function () {
  "use strict";

  var DEFAULT_PRICE = "$14.99/mo";

  function formatPrice() {
    try {
      var text = (window.NSB_CONFIG && window.NSB_CONFIG.PRO_PRICE_TEXT) || DEFAULT_PRICE;
      return typeof text === "string" && text.length > 0 ? text : DEFAULT_PRICE;
    } catch (e) {}
    return DEFAULT_PRICE;
  }

  function modalBenefits() {
    return [
      "No daily caps on generators: run tools as much as you need while Pro is active.",
      "Save and load calculator presets (loan payoff & burn/runway) from the Pro hub.",
      "Export full CSVs and re-import saved files on supported calculators.",
    ];
  }

  function lifetimePitch() {
    return "Pay once, lifetime access. Unlock with the same email you use at checkout.";
  }

  function inlineLockText(context) {
    switch (context) {
      case "export":
        return "Export to CSV. Unlock Pro.";
      case "import":
        return "Import from CSV. Unlock Pro.";
      case "presets":
      case "save":
      case "load":
        return "Save inputs for next time. Unlock Pro.";
      default:
        return "Unlock Pro to continue.";
    }
  }

  function bottomStripText(toolHint) {
    var headline = "Running this again? Save your inputs and export to CSV.";
    if (toolHint === "calculator") {
      headline = "Running this monthly? Save your inputs and export to CSV.";
    }
    var price = formatPrice();
    var subtext = "NSB Tools Pro. " + price + ".";
    return { headline: headline, subtext: subtext };
  }

  window.NSB_PRO_COPY = {
    formatPrice: formatPrice,
    modalBenefits: modalBenefits,
    lifetimePitch: lifetimePitch,
    inlineLockText: inlineLockText,
    bottomStripText: bottomStripText,
  };
})();
