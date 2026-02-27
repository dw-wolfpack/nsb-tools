/**
 * NSB Tools - Scenario Builder
 * Save, load, compare scenarios. Free: 2 saved, 2 compare. Pro: unlimited, 4 compare.
 */
(function () {
  "use strict";

  const FREE_MAX_SAVED = 2;
  const FREE_MAX_COMPARE = 2;
  const PRO_MAX_COMPARE = 4;
  const KEY_PREFIX = "nsb_scenarios_";

  function isPro() {
    try {
      return localStorage.getItem("nsb_pro") === "true";
    } catch (e) {
      return false;
    }
  }

  function getKey(toolSlug) {
    return KEY_PREFIX + (toolSlug || "");
  }

  function listRaw(toolSlug) {
    try {
      const raw = localStorage.getItem(getKey(toolSlug));
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveRaw(toolSlug, arr) {
    try {
      localStorage.setItem(getKey(toolSlug), JSON.stringify(arr));
      return true;
    } catch (e) {
      return false;
    }
  }

  window.NSB_SCENARIOS = {
    save(toolSlug, scenarioObj) {
      const arr = listRaw(toolSlug);
      const max = isPro() ? 999 : FREE_MAX_SAVED;
      if (arr.length >= max) return null;
      const id = "sc_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
      const item = { id, name: scenarioObj.name || "Scenario " + (arr.length + 1), at: new Date().toISOString(), data: scenarioObj };
      arr.push(item);
      saveRaw(toolSlug, arr);
      return id;
    },

    list(toolSlug) {
      return listRaw(toolSlug).map(function (x) { return { id: x.id, name: x.name, at: x.at }; });
    },

    load(toolSlug, id) {
      const arr = listRaw(toolSlug);
      const found = arr.find(function (x) { return x.id === id; });
      return found ? found.data : null;
    },

    remove(toolSlug, id) {
      const arr = listRaw(toolSlug).filter(function (x) { return x.id !== id; });
      saveRaw(toolSlug, arr);
      return true;
    },

    compare(toolSlug, ids) {
      const max = isPro() ? PRO_MAX_COMPARE : FREE_MAX_COMPARE;
      const limited = (ids || []).slice(0, max);
      const arr = listRaw(toolSlug);
      return limited.map(function (id) {
        const x = arr.find(function (item) { return item.id === id; });
        return x ? { id: x.id, name: x.name, data: x.data } : null;
      }).filter(Boolean);
    },

    exportCSV(toolSlug, ids, columnsFn) {
      const scenarios = this.compare(toolSlug, ids);
      if (!scenarios.length) return "";
      const cols = typeof columnsFn === "function" ? columnsFn(scenarios[0].data) : Object.keys(scenarios[0].data || {});
      const rows = [["Scenario", "ID"].concat(cols)];
      scenarios.forEach(function (s) {
        const r = [s.name, s.id];
        cols.forEach(function (c) {
          const v = (s.data || {})[c];
          r.push(v != null ? v : "");
        });
        rows.push(r);
      });
      return window.NSB_UTILS ? window.NSB_UTILS.exportCSV(rows) : "";
    },

    canSaveMore(toolSlug) {
      return listRaw(toolSlug).length < (isPro() ? 999 : FREE_MAX_SAVED);
    },

    maxCompare() {
      return isPro() ? PRO_MAX_COMPARE : FREE_MAX_COMPARE;
    },

    isPro
  };

  function esc(s) { return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  window.NSB_SCENARIOS.renderUI = function (container, config) {
    const slug = config.slug;
    const getParams = config.getParams;
    const setParams = config.setParams;
    const getOutputData = config.getOutputData;
    const columnsFn = config.columnsFn;
    const calcFn = config.calcFn;
    const paramKeys = config.paramKeys || [];
    const run = config.run;
    const fmt = config.format || (function (n) { return typeof n === "number" ? (window.NSB_UTILS && window.NSB_UTILS.formatCurrency ? window.NSB_UTILS.formatCurrency(n) : "$" + n) : String(n || ""); });

    if (!container || !slug) return;
    const scenariosEl = typeof container === "string" ? document.querySelector(container) : container;
    if (!scenariosEl) return;

    function render() {
      const list = window.NSB_SCENARIOS.list(slug);
      const canSave = window.NSB_SCENARIOS.canSaveMore(slug);
      const maxCompare = window.NSB_SCENARIOS.maxCompare();

      let html = '<section class="card scenario-section"><h3>Scenarios</h3>';
      html += '<div class="form-group"><label>Save current</label><div class="share-row">';
      html += '<input type="text" id="scenario-name" placeholder="Scenario name">';
      html += '<button type="button" class="btn btn-secondary" id="scenario-save"' + (canSave ? "" : " disabled") + '>Save</button></div></div>';

      if (list.length) {
        html += '<div class="form-group"><label>Load</label><div class="share-row">';
        html += '<select id="scenario-load"><option value="">Select...</option>';
        list.forEach(function (s) { html += '<option value="' + esc(s.id) + '">' + esc(s.name || s.id) + "</option>"; });
        html += '</select><button type="button" class="btn btn-secondary" id="scenario-load-btn">Load</button></div></div>';
        html += '<div class="form-group"><label>Compare (up to ' + maxCompare + ')</label><div id="scenario-compare-checks"></div>';
        html += '<button type="button" class="btn btn-secondary" id="scenario-compare-btn">Compare</button></div>';
        html += '<div id="scenario-compare-table"></div>';
        html += '<div class="btn-group"><button type="button" class="btn btn-secondary" id="scenario-export">Export CSV</button></div>';
      }
      html += "</section>";
      scenariosEl.innerHTML = html;

      const saveBtn = scenariosEl.querySelector("#scenario-save");
      const nameInput = scenariosEl.querySelector("#scenario-name");
      if (saveBtn && nameInput) {
        saveBtn.addEventListener("click", function () {
          const name = (nameInput.value || "Scenario").trim();
          const inp = getParams();
          const res = calcFn ? calcFn(inp) : null;
          const data = { name: name };
          Object.keys(inp || {}).forEach(function (k) { data[k] = inp[k]; });
          if (res && getOutputData) { const o = getOutputData(res); Object.keys(o || {}).forEach(function (k) { data[k] = o[k]; }); }
          const id = window.NSB_SCENARIOS.save(slug, data);
          if (id) { nameInput.value = ""; render(); if (window.NSB_TOAST) window.NSB_TOAST.show("Saved"); }
          else if (window.NSB_OPEN_UPGRADE) window.NSB_OPEN_UPGRADE();
        });
      }

      const loadSelect = scenariosEl.querySelector("#scenario-load");
      const loadBtn = scenariosEl.querySelector("#scenario-load-btn");
      if (loadBtn && loadSelect) {
        loadBtn.addEventListener("click", function () {
          const id = loadSelect.value;
          if (!id) return;
          const data = window.NSB_SCENARIOS.load(slug, id);
          if (data && setParams) { setParams(data); if (run) run(); if (window.NSB_TOAST) window.NSB_TOAST.show("Loaded"); }
        });
      }

      const compareChecks = scenariosEl.querySelector("#scenario-compare-checks");
      if (compareChecks) list.forEach(function (s) {
        const c = document.createElement("label");
        c.innerHTML = '<input type="checkbox" data-id="' + esc(s.id) + '"> ' + esc(s.name || s.id);
        compareChecks.appendChild(c);
      });

      const compareBtn = scenariosEl.querySelector("#scenario-compare-btn");
      const compareTable = scenariosEl.querySelector("#scenario-compare-table");
      if (compareBtn && compareTable && columnsFn) {
        compareBtn.addEventListener("click", function () {
          const ids = [].slice.call(scenariosEl.querySelectorAll("#scenario-compare-checks input:checked")).map(function (c) { return c.dataset.id; }).slice(0, maxCompare);
          const rows = window.NSB_SCENARIOS.compare(slug, ids);
          if (!rows.length) { compareTable.innerHTML = ""; return; }
          const cols = columnsFn();
          let tbl = '<table class="compare-table"><thead><tr><th>Scenario</th>';
          cols.forEach(function (c) { tbl += "<th>" + esc(c) + "</th>"; });
          tbl += "</tr></thead><tbody>";
          rows.forEach(function (r) {
            tbl += "<tr><td>" + esc(r.name) + "</td>";
            cols.forEach(function (c) {
              const v = r.data ? r.data[c] : "";
              tbl += "<td>" + esc(typeof v === "number" ? fmt(v) : v) + "</td>";
            });
            tbl += "</tr>";
          });
          tbl += "</tbody></table>";
          compareTable.innerHTML = tbl;
        });
      }

      const exportBtn = scenariosEl.querySelector("#scenario-export");
      if (exportBtn) {
        exportBtn.addEventListener("click", function () {
          const ids = [].slice.call(scenariosEl.querySelectorAll("#scenario-compare-checks input:checked")).map(function (c) { return c.dataset.id; }).slice(0, maxCompare);
          const useIds = ids.length ? ids : list.map(function (s) { return s.id; });
          const csv = window.NSB_SCENARIOS.exportCSV(slug, useIds, columnsFn);
          if (csv && window.NSB_UTILS && window.NSB_UTILS.downloadFile) {
            window.NSB_UTILS.downloadFile(csv, slug + "-scenarios.csv", "text/csv");
            if (window.NSB_TOAST) window.NSB_TOAST.show("Exported");
          }
        });
      }
    }
    render();
  };
})();
