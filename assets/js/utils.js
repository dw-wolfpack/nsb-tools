/**
 * NSB Tools - Shared utilities
 */

(function () {
  "use strict";

  window.NSB_UTILS = {
    /**
     * Simple hash for seeded PRNG
     */
    hash(str) {
      let h = 0;
      const s = String(str);
      for (let i = 0; i < s.length; i++) {
        const c = s.charCodeAt(i);
        h = ((h << 5) - h) + c;
        h = h & h;
      }
      return Math.abs(h);
    },

    /**
     * Seeded PRNG (mulberry32) - deterministic given seed
     */
    seededPRNG(seed) {
      let s = seed;
      return function () {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },

    /**
     * Sanitize user input for safe display
     */
    sanitize(str) {
      if (str == null || typeof str !== "string") return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .trim()
        .slice(0, 10000);
    },

    /**
     * Sleep for ms milliseconds
     */
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /**
     * Random integer between min and max (inclusive)
     */
    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Run async work with a thinking delay. Calls onStart, waits random ms, runs fn, calls onEnd.
     * @param {Promise|Function} promiseOrFn - async function or promise
     * @param {Object} opts - { minMs, maxMs, onStart, onEnd }
     */
    async withThinking(promiseOrFn, opts) {
      const { minMs = 450, maxMs = 900, onStart, onEnd } = opts || {};
      if (onStart) onStart();
      const ms = this.randInt(minMs, maxMs);
      await this.sleep(ms);
      const result = typeof promiseOrFn === "function" ? await promiseOrFn() : await promiseOrFn;
      if (onEnd) onEnd();
      return result;
    },

    /**
     * Set busy state: add/remove .is-busy, disable Generate/Regenerate, show/hide Thinking status.
     * @param {Element} containerEl - root container (e.g. main.layout)
     * @param {boolean} isBusy
     */
    setBusy(containerEl, isBusy) {
      if (!containerEl) return;
      const gen = containerEl.querySelector("#nsb-generate");
      const regen = containerEl.querySelector("#nsb-regen");
      const output = containerEl.querySelector("#nsb-output");
      let statusEl = containerEl.querySelector(".nsb-thinking-status");

      if (isBusy) {
        containerEl.classList.add("is-busy");
        if (gen) gen.disabled = true;
        if (regen) regen.disabled = true;
        if (!statusEl && output) {
          statusEl = document.createElement("div");
          statusEl.className = "nsb-thinking-status";
          statusEl.setAttribute("aria-live", "polite");
          statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> <span class="nsb-thinking-label">Thinking...</span>';
          output.parentNode.insertBefore(statusEl, output);
        }
        if (statusEl) {
          statusEl.hidden = false;
          const label = statusEl.querySelector(".nsb-thinking-label");
          if (label) label.textContent = "Thinking...";
        }
      } else {
        containerEl.classList.remove("is-busy");
        if (gen) gen.disabled = false;
        if (regen) regen.disabled = false;
        if (statusEl) {
          const label = statusEl.querySelector(".nsb-thinking-label");
          if (label) label.textContent = "Done";
          setTimeout(() => {
            if (statusEl) statusEl.hidden = true;
          }, 400);
        }
      }
    },

    /**
     * Debounce function calls
     */
    debounce(fn, ms) {
      let id;
      return function (...args) {
        clearTimeout(id);
        id = setTimeout(() => fn.apply(this, args), ms);
      };
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      }
    },

    /**
     * Export array of objects or rows to CSV string
     */
    exportCSV(rows) {
      if (!rows || !rows.length) return "";
      const escape = (v) => {
        const s = String(v ?? "");
        return s.includes(",") || s.includes('"') || s.includes("\n")
          ? '"' + s.replace(/"/g, '""') + '"'
          : s;
      };
      const headers = Array.isArray(rows[0]) ? null : Object.keys(rows[0]);
      const lines = [];
      if (headers) lines.push(headers.map(escape).join(","));
      rows.forEach((r) => {
        const vals = Array.isArray(r) ? r : headers.map((h) => r[h]);
        lines.push(vals.map(escape).join(","));
      });
      return lines.join("\n");
    },

    /**
     * Trigger file download
     */
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType || "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },

    /**
     * localStorage helpers
     */
    storage: {
      get(key, def) {
        try {
          const v = localStorage.getItem(key);
          return v != null ? JSON.parse(v) : def;
        } catch {
          return def;
        }
      },
      set(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      },
      remove(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch {
          return false;
        }
      }
    },

    /**
     * Get base path for relative links (works under / and subpaths)
     */
    getBasePath() {
      const path = window.location.pathname;
      if (path === "/" || path === "/index.html") return "/";
      const parts = path.split("/").filter(Boolean);
      if (parts[0] === "tools" || parts[0] === "categories" || parts[0] === "about" || parts[0] === "privacy" || parts[0] === "terms" || parts[0] === "changelog" || parts[0] === "updates") {
        return "/";
      }
      return "/";
    }
  };
})();
