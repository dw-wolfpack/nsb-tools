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

  window.NSB_CSV = {
    toCSV: toCSV,
    downloadCSV: downloadCSV
  };
})();
