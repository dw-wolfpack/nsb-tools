/**
 * NSB Tools Pro Store - local-first preset storage.
 * Storage key: nsb_pro_state_v1
 * Shape: { version: 1, presets: [{ id, toolSlug, name, inputs, createdAt, updatedAt }] }
 */
(function () {
  "use strict";

  var STORAGE_KEY = "nsb_pro_state_v1";
  var MAX_NAME_LENGTH = 60;
  var MAX_PRESETS = 200;

  function uuid() {
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {}
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  function now() {
    return new Date().toISOString();
  }

  function clampName(name) {
    return String(name || "Untitled").trim().slice(0, MAX_NAME_LENGTH) || "Untitled";
  }

  function safeJsonParse(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: 1, presets: [] };
      var parsed = safeJsonParse(raw);
      if (!parsed || typeof parsed !== "object") return { version: 1, presets: [] };
      return {
        version: parsed.version || 1,
        presets: Array.isArray(parsed.presets) ? parsed.presets : [],
      };
    } catch (e) {
      return { version: 1, presets: [] };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function dispatchPresetsChanged() {
    try {
      if (typeof window !== "undefined" && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent("nsb:pro-presets-changed"));
      }
    } catch (e) {}
  }

  function isValidPreset(p) {
    return p && typeof p === "object" && typeof p.id === "string" && typeof p.toolSlug === "string" && typeof p.name === "string";
  }

  function listPresets(toolSlug) {
    var state = loadState();
    var presets = state.presets;
    if (toolSlug) presets = presets.filter(function (p) { return p.toolSlug === toolSlug; });
    return presets.slice();
  }

  function savePreset(opts) {
    if (!opts || !opts.toolSlug || !opts.name) return null;
    var state = loadState();
    var id = opts.id || uuid();
    var existing = state.presets.findIndex(function (p) { return p.id === id; });
    var preset = {
      id: id,
      toolSlug: String(opts.toolSlug),
      name: clampName(opts.name),
      inputs: opts.inputs && typeof opts.inputs === "object" ? opts.inputs : {},
      createdAt: existing >= 0 ? state.presets[existing].createdAt : now(),
      updatedAt: now(),
    };
    if (existing >= 0) {
      state.presets[existing] = preset;
    } else {
      if (state.presets.length >= MAX_PRESETS) state.presets.shift();
      state.presets.push(preset);
    }
    saveState(state);
    dispatchPresetsChanged();
    return preset;
  }

  function deletePreset(id) {
    var state = loadState();
    state.presets = state.presets.filter(function (p) { return p.id !== id; });
    saveState(state);
    dispatchPresetsChanged();
  }

  function renamePreset(id, newName) {
    var state = loadState();
    var idx = state.presets.findIndex(function (p) { return p.id === id; });
    if (idx < 0) return;
    state.presets[idx].name = clampName(newName);
    state.presets[idx].updatedAt = now();
    saveState(state);
    dispatchPresetsChanged();
  }

  function exportPresets() {
    var state = loadState();
    var json = JSON.stringify({ version: 1, presets: state.presets }, null, 2);
    try {
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "nsb-presets.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {}
  }

  function importPresets(jsonText) {
    var parsed = safeJsonParse(jsonText);
    if (!parsed || !Array.isArray(parsed.presets)) {
      return { ok: false, error: "Invalid file format.", added: 0, skipped: 0 };
    }
    var state = loadState();
    var existingIds = new Set(state.presets.map(function (p) { return p.id; }));
    var added = 0;
    var skipped = 0;
    parsed.presets.forEach(function (p) {
      if (!isValidPreset(p)) { skipped++; return; }
      if (existingIds.has(p.id)) { skipped++; return; }
      if (state.presets.length >= MAX_PRESETS) { skipped++; return; }
      state.presets.push({
        id: p.id,
        toolSlug: String(p.toolSlug),
        name: clampName(p.name),
        inputs: p.inputs && typeof p.inputs === "object" ? p.inputs : {},
        createdAt: p.createdAt || now(),
        updatedAt: p.updatedAt || now(),
      });
      existingIds.add(p.id);
      added++;
    });
    saveState(state);
    dispatchPresetsChanged();
    return { ok: true, added: added, skipped: skipped };
  }

  window.NSB_PRO_STORE = {
    listPresets: listPresets,
    savePreset: savePreset,
    deletePreset: deletePreset,
    renamePreset: renamePreset,
    exportPresets: exportPresets,
    importPresets: importPresets,
  };
})();
