/**
 * NSB Pro Actions - Save/Load preset buttons injected near #nsb-output on tool pages.
 * API: window.NSB_PRO_ACTIONS.mount(toolSlug)
 */
(function () {
  "use strict";

  var TOOL_LABELS = {
    "loan-debt-payoff-calculator": "Loan Payoff",
    "burn-rate-runway-calculator": "Burn Rate",
  };

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getAdapter(slug) {
    return window.NSB_TOOL_ADAPTERS && window.NSB_TOOL_ADAPTERS.getAdapter(slug);
  }

  function getStore() {
    return window.NSB_PRO_STORE;
  }

  function showToast(msg) {
    if (window.NSB_TOAST && typeof window.NSB_TOAST.show === "function") window.NSB_TOAST.show(msg);
  }

  function openModal(html) {
    if (window.NSB_MODAL && typeof window.NSB_MODAL.open === "function") {
      window.NSB_MODAL.open(html);
    }
  }

  function closeModal() {
    if (window.NSB_MODAL && typeof window.NSB_MODAL.close === "function") window.NSB_MODAL.close();
  }

  function promptSavePreset(toolSlug) {
    var adapter = getAdapter(toolSlug);
    var store = getStore();
    if (!adapter || !store) {
      showToast("Save unavailable. Refresh and try again.");
      return;
    }

    var html =
      '<h2 id="nsb-modal-title">Save Preset</h2>' +
      '<p class="small muted">Name this set of inputs so you can reload it later.</p>' +
      '<label for="nsb-preset-name-input">Preset name</label>' +
      '<input type="text" id="nsb-preset-name-input" class="input" maxlength="60" placeholder="e.g. Aggressive payoff plan" style="margin-top:.25rem;">' +
      '<p id="nsb-preset-name-error" class="modal-pro-error" hidden></p>' +
      '<div class="modal-actions" style="margin-top:1rem;">' +
      '<button type="button" class="btn btn-primary" id="nsb-preset-save-confirm">Save</button>' +
      '<button type="button" class="btn btn-secondary" data-nsb-modal-close>Cancel</button>' +
      "</div>";

    openModal(html);

    setTimeout(function () {
      var nameInput = document.getElementById("nsb-preset-name-input");
      var saveBtn = document.getElementById("nsb-preset-save-confirm");
      var errEl = document.getElementById("nsb-preset-name-error");
      if (nameInput) nameInput.focus();
      if (saveBtn) {
        saveBtn.addEventListener("click", function () {
          var name = nameInput ? nameInput.value.trim() : "";
          if (!name) {
            if (errEl) { errEl.textContent = "Please enter a name."; errEl.hidden = false; }
            if (nameInput) nameInput.focus();
            return;
          }
          var inputs = adapter.readInputs();
          store.savePreset({ toolSlug: toolSlug, name: name, inputs: inputs });
          closeModal();
          showToast("Preset saved");
        });
      }
      if (nameInput) {
        nameInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter" && saveBtn) saveBtn.click();
        });
      }
    }, 0);
  }

  function buildPresetListHtml(presets) {
    if (!presets || !presets.length) {
      return '<p class="small muted">No presets saved for this tool yet.</p>';
    }
    var rows = presets.map(function (p) {
      var date = p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "";
      return (
        '<li class="preset-list-item" style="display:flex;align-items:center;gap:.5rem;padding:.35rem 0;border-bottom:1px solid var(--border, #e2e8f0);">' +
        '<span style="flex:1;font-size:.9rem;">' + esc(p.name) + (date ? '<span class="small muted" style="margin-left:.5rem;">' + esc(date) + "</span>" : "") + "</span>" +
        '<button type="button" class="btn btn-primary btn-sm" data-nsb-load-preset="' + esc(p.id) + '">Load</button>' +
        "</li>"
      );
    });
    return '<ul style="list-style:none;margin:0;padding:0;">' + rows.join("") + "</ul>";
  }

  function openLoadModal(toolSlug) {
    var adapter = getAdapter(toolSlug);
    var store = getStore();
    if (!adapter || !store) {
      showToast("Load unavailable. Refresh and try again.");
      return;
    }
    var presets = store.listPresets(toolSlug);

    var html =
      '<h2 id="nsb-modal-title">Load Preset</h2>' +
      buildPresetListHtml(presets) +
      '<div class="modal-actions" style="margin-top:1rem;">' +
      '<button type="button" class="btn btn-secondary" data-nsb-modal-close>Close</button>' +
      "</div>";

    openModal(html);

    setTimeout(function () {
      var overlay = document.getElementById("nsb-modal-overlay");
      if (!overlay) return;
      overlay.querySelectorAll("[data-nsb-load-preset]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-nsb-load-preset");
          var preset = store.listPresets(toolSlug).find(function (p) { return p.id === id; });
          if (!preset) { showToast("Preset not found."); return; }
          closeModal();
          adapter.applyInputs(preset.inputs);
          adapter.runIfAvailable();
          showToast("Preset loaded");
        });
      });
    }, 0);
  }

  function refreshLoadListIfOpen(toolSlug) {
    var overlay = document.getElementById("nsb-modal-overlay");
    if (!overlay || overlay.hidden) return;
    var title = overlay.querySelector("#nsb-modal-title");
    if (!title || title.textContent !== "Load Preset") return;
    var store = getStore();
    var adapter = getAdapter(toolSlug);
    if (!store || !adapter) return;
    var listContainer = overlay.querySelector("ul");
    if (!listContainer) return;
    var presets = store.listPresets(toolSlug);
    listContainer.outerHTML = buildPresetListHtml(presets);
    var newList = overlay.querySelector("ul");
    if (newList) {
      newList.querySelectorAll("[data-nsb-load-preset]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("data-nsb-load-preset");
          var preset = store.listPresets(toolSlug).find(function (p) { return p.id === id; });
          if (!preset) { showToast("Preset not found."); return; }
          if (window.NSB_MODAL && typeof window.NSB_MODAL.close === "function") window.NSB_MODAL.close();
          adapter.applyInputs(preset.inputs);
          adapter.runIfAvailable();
          showToast("Preset loaded");
        });
      });
    }
  }

  var mountedToolSlug = null;
  var proSectionSlug = null;

  function isPro() {
    try {
      return window.NSB_PRO && typeof window.NSB_PRO.isPro === "function" && window.NSB_PRO.isPro();
    } catch (e) { return false; }
  }

  function renderProSectionContent(section, toolSlug) {
    var store = getStore();
    var adapter = getAdapter(toolSlug);
    if (!section) return;
    if (!isPro()) {
      section.innerHTML = '<h3>Pro</h3><p>Save presets and move full results with CSV export and import on this calculator.</p><button type="button" class="btn btn-pro" id="nsb-pro-section-upgrade">Upgrade</button>';
      var up = document.getElementById("nsb-pro-section-upgrade");
      if (up) up.addEventListener("click", function () { if (window.NSB_OPEN_UPGRADE) window.NSB_OPEN_UPGRADE(); });
      return;
    }
    if (!store || !adapter) {
      section.innerHTML = '<h3>Pro</h3><p>Presets, CSV export, and CSV import on this calculator.</p><a href="/pro/" class="btn btn-pro">Pro hub</a>';
      return;
    }
    var presets = store.listPresets(toolSlug);
    var listHtml = presets.length
      ? buildPresetListHtml(presets)
      : '<p class="small muted">No presets saved yet. Run the calculator above, then use Save preset to add one.</p>';
    section.innerHTML =
      '<h3>Presets</h3>' +
      listHtml +
      '<p class="small muted" style="margin-top:.75rem;">Save preset, Export CSV, and Import CSV appear above after you run the calculator.</p>';
    section.querySelectorAll("[data-nsb-load-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-nsb-load-preset");
        var preset = store.listPresets(toolSlug).find(function (p) { return p.id === id; });
        if (!preset) { showToast("Preset not found."); return; }
        adapter.applyInputs(preset.inputs);
        adapter.runIfAvailable();
        showToast("Preset loaded");
      });
    });
  }

  function mountProSection(toolSlug) {
    var section = document.getElementById("nsb-pro-section");
    if (!section) return;
    proSectionSlug = toolSlug;
    renderProSectionContent(section, toolSlug);
    if (!window._nsbProSectionPresetsListener) {
      window._nsbProSectionPresetsListener = true;
      window.addEventListener("nsb:pro-presets-changed", function () {
        if (proSectionSlug) {
          var el = document.getElementById("nsb-pro-section");
          if (el) renderProSectionContent(el, proSectionSlug);
        }
      });
    }
  }

  function mount(toolSlug) {
    var outputEl = document.getElementById("nsb-output");
    if (!outputEl) return;

    if (outputEl.getAttribute("data-nsb-pro-actions-mounted")) return;
    outputEl.setAttribute("data-nsb-pro-actions-mounted", "1");
    mountedToolSlug = toolSlug;

    var row = document.createElement("div");
    row.className = "pro-actions-row";
    row.setAttribute("role", "group");
    row.setAttribute("aria-label", "Presets");
    row.style.marginTop = "0.75rem";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "0.5rem";
    row.style.flexWrap = "wrap";

    var label = document.createElement("span");
    label.className = "small muted";
    label.style.marginRight = "0.25rem";
    label.textContent = "Presets:";

    var btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    var saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "btn btn-primary btn-sm";
    saveBtn.setAttribute("data-nsb-lock-context", "presets");
    saveBtn.textContent = "Save preset";
    saveBtn.addEventListener("click", function () {
      if (!window.NSB_PRO || typeof window.NSB_PRO.requirePro !== "function") {
        showToast("Pro required.");
        return;
      }
      if (!isPro() && window.NSB_PRO_INLINE_LOCK && typeof window.NSB_PRO_INLINE_LOCK.show === "function") {
        window.NSB_PRO_INLINE_LOCK.show(saveBtn);
      }
      window.NSB_PRO.requirePro(function () { promptSavePreset(toolSlug); });
    });

    var loadBtn = document.createElement("button");
    loadBtn.type = "button";
    loadBtn.className = "btn btn-secondary btn-sm";
    loadBtn.setAttribute("data-nsb-lock-context", "presets");
    loadBtn.textContent = "Load preset";
    loadBtn.addEventListener("click", function () {
      if (!window.NSB_PRO || typeof window.NSB_PRO.requirePro !== "function") {
        showToast("Pro required.");
        return;
      }
      if (!isPro() && window.NSB_PRO_INLINE_LOCK && typeof window.NSB_PRO_INLINE_LOCK.show === "function") {
        window.NSB_PRO_INLINE_LOCK.show(loadBtn);
      }
      window.NSB_PRO.requirePro(function () { openLoadModal(toolSlug); });
    });

    btnGroup.appendChild(saveBtn);
    btnGroup.appendChild(loadBtn);
    row.appendChild(label);
    row.appendChild(btnGroup);

    outputEl.parentNode.insertBefore(row, outputEl.nextSibling);

    if (!window._nsbProActionsPresetsListener) {
      window._nsbProActionsPresetsListener = true;
      window.addEventListener("nsb:pro-presets-changed", function () {
        if (mountedToolSlug) refreshLoadListIfOpen(mountedToolSlug);
      });
    }
  }

  window.NSB_PRO_ACTIONS = {
    mount: mount,
    mountProSection: mountProSection,
  };
})();
