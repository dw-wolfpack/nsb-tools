/**
 * NSB Tools - CSV helpers for export (Pro-gated).
 */

(function () {
  "use strict";

  function escapeCell(value) {
    var s = value == null ? "" : String(value);
    if (/[",\r\n]/.test(s)) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  /**
   * @param {Array<Object>} rows - Array of objects (same keys)
   * @param {Array<string>} headers - Column keys in order
   * @returns {string} CSV string
   */
  function toCSV(rows, headers) {
    if (!Array.isArray(headers) || headers.length === 0) return "";
    var headerRow = headers.map(escapeCell).join(",");
    if (!Array.isArray(rows) || rows.length === 0) return headerRow + "\n";
    var body = rows.map(function (row) {
      return headers.map(function (key) {
        return escapeCell(row[key]);
      }).join(",");
    }).join("\n");
    return headerRow + "\n" + body;
  }

  /**
   * @param {string} filename - e.g. "export.csv"
   * @param {string} csvText - Full CSV string
   */
  function downloadCSV(filename, csvText) {
    if (typeof document === "undefined" || !document.createElement) return;
    try {
      var blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
      var url = typeof URL !== "undefined" && URL.createObjectURL ? URL.createObjectURL(blob) : null;
      if (!url) return;
      var a = document.createElement("a");
      a.href = url;
      a.download = filename || "export.csv";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (URL.revokeObjectURL) URL.revokeObjectURL(url);
    } catch (e) {}
  }

  /**
   * Parse one RFC4180-style CSV table into headers + row objects.
   * @param {string} text
   * @returns {{ headers: string[], rows: Array<Record<string, string>> }}
   */
  function parseCSVText(text) {
    if (text == null || String(text).trim() === "") return { headers: [], rows: [] };
    var s = String(text).replace(/^\uFEFF/, "");
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (inQuotes) {
        if (c === '"') {
          if (s.charAt(i + 1) === '"') {
            field += '"';
            i += 2;
            continue;
          }
          inQuotes = false;
          i++;
          continue;
        }
        field += c;
        i++;
        continue;
      }
      if (c === '"') {
        inQuotes = true;
        i++;
        continue;
      }
      if (c === ",") {
        row.push(field);
        field = "";
        i++;
        continue;
      }
      if (c === "\r") {
        i++;
        continue;
      }
      if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
        i++;
        continue;
      }
      field += c;
      i++;
    }
    row.push(field);
    if (!(row.length === 1 && row[0] === "")) {
      rows.push(row);
    }
    while (rows.length > 0) {
      var last = rows[rows.length - 1];
      if (last.length === 1 && last[0] === "") rows.pop();
      else break;
    }
    if (rows.length === 0) return { headers: [], rows: [] };
    var headers = rows[0].map(function (h) { return String(h).trim(); });
    var dataRows = [];
    for (var r = 1; r < rows.length; r++) {
      var cells = rows[r];
      var o = {};
      for (var j = 0; j < headers.length; j++) {
        o[headers[j]] = cells[j] != null ? String(cells[j]) : "";
      }
      dataRows.push(o);
    }
    return { headers: headers, rows: dataRows };
  }

  var INPUT_MARK = "# nsb-inputs\n";
  var SCHEDULE_MARK = "\n# nsb-schedule\n";

  /**
   * Pro export: inputs table + schedule table (round-trip for Import CSV).
   */
  function buildToolExportCSV(inputRow, inputKeys, scheduleRows, scheduleHeaders) {
    if (!Array.isArray(inputKeys) || inputKeys.length === 0) return toCSV(scheduleRows, scheduleHeaders);
    var a = toCSV([inputRow], inputKeys);
    var b = toCSV(scheduleRows, scheduleHeaders || []);
    return INPUT_MARK + a + SCHEDULE_MARK + b;
  }

  /**
   * Split combined export; returns parsed inputs table (or null) and raw schedule CSV text for legacy files.
   * @returns {{ inputs: { headers: string[], rows: Array<Record<string,string>> } | null, scheduleTable: { headers: string[], rows: Array<Record<string,string>> }, legacyScheduleOnly: boolean }}
   */
  function parseToolExportWithInputs(text) {
    if (text == null || String(text).trim() === "") {
      return { inputs: null, scheduleTable: { headers: [], rows: [] }, legacyScheduleOnly: true };
    }
    var full = String(text).replace(/^\uFEFF/, "");
    var idx = full.indexOf(SCHEDULE_MARK);
    if (idx === -1) {
      var t = parseCSVText(full);
      return { inputs: null, scheduleTable: t, legacyScheduleOnly: true };
    }
    var head = full.slice(0, idx);
    if (head.indexOf(INPUT_MARK) === 0) head = head.slice(INPUT_MARK.length);
    var tail = full.slice(idx + SCHEDULE_MARK.length);
    var inputsParsed = parseCSVText(head);
    var scheduleParsed = parseCSVText(tail);
    var hasInputs = inputsParsed.headers.length > 0 && inputsParsed.rows.length > 0;
    return {
      inputs: hasInputs ? inputsParsed : null,
      scheduleTable: scheduleParsed,
      legacyScheduleOnly: false
    };
  }

  window.NSB_CSV = {
    toCSV: toCSV,
    downloadCSV: downloadCSV,
    parseCSVText: parseCSVText,
    buildToolExportCSV: buildToolExportCSV,
    parseToolExportWithInputs: parseToolExportWithInputs,
    INPUT_MARK: INPUT_MARK,
    SCHEDULE_MARK: SCHEDULE_MARK
  };
})();
