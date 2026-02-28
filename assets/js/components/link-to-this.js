/**
 * NSB Tools - Link to this page component
 * Collapsed-by-default "Share" card with copy URL and copy anchor text buttons.
 * URL prefers canonical origin (production) over localhost.
 * Anchor text defaults to an SEO-friendly phrase derived from H1/title + path context.
 */
(function () {
  "use strict";

  var PROD_ORIGIN = "https://tools.nextstepsbeyond.online";

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getCanonicalOrigin() {
    try {
      var link = document.querySelector('link[rel="canonical"]');
      if (!link || !link.href) return "";
      var u = new URL(link.href);
      return u && u.origin ? u.origin : "";
    } catch (e) {
      return "";
    }
  }

  function getBestOrigin(opts) {
    if (opts && opts.origin) return String(opts.origin);

    var canonicalOrigin = getCanonicalOrigin();
    if (canonicalOrigin) return canonicalOrigin;

    var host = (window.location && window.location.hostname) ? window.location.hostname : "";
    var isLocal = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
    if (isLocal) return PROD_ORIGIN;

    return (window.location && window.location.origin) ? window.location.origin : PROD_ORIGIN;
  }

  function buildPageUrl(opts) {
    var origin = getBestOrigin(opts);
    var path = (window.location && window.location.pathname) ? window.location.pathname : "/";
    return origin + path;
  }

  function collapseWhitespace(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function stripSiteSuffix(title) {
    var t = collapseWhitespace(title);
    // Remove common suffix patterns, keep it conservative
    t = t.replace(/\s*\|\s*NSB Tools\s*$/i, "");
    return t;
  }

  function getSingleH1Text() {
    try {
      var h1s = document.querySelectorAll("h1");
      if (!h1s || h1s.length !== 1) return "";
      return collapseWhitespace(h1s[0].textContent || "");
    } catch (e) {
      return "";
    }
  }

  function pathContextSuffix(pathname) {
    var p = pathname || "";
    if (p.indexOf("/ai/playbooks/") === 0) return " playbook";
    if (p.indexOf("/ai/checklists/") === 0) return " checklist";
    if (p.indexOf("/tools/") === 0) return " tool";
    return "";
  }

  function preserveAcronyms(text) {
    // We want mostly lowercase, but preserve some acronyms wherever they appear.
    // Approach: lower everything, then replace acronym tokens back to uppercase forms.
    var s = String(text || "");
    var lowered = s.toLowerCase();

    var replacements = [
      { re: /\bai\b/g, val: "AI" },
      { re: /\bsaas\b/g, val: "SaaS" },
      { re: /\bltv\b/g, val: "LTV" },
      { re: /\bcac\b/g, val: "CAC" },
      { re: /\barpa\b/g, val: "ARPA" },
      { re: /\barpu\b/g, val: "ARPU" }
    ];

    var out = lowered;
    replacements.forEach(function (r) { out = out.replace(r.re, r.val); });
    return out;
  }

  function truncate(s, maxLen) {
    var str = String(s || "");
    if (str.length <= maxLen) return str;
    return str.slice(0, Math.max(0, maxLen - 3)).trim() + "...";
  }

  function buildDefaultAnchorText(url) {
    var h1 = getSingleH1Text();
    var base = h1 || stripSiteSuffix(document.title || "") || url || "NSB Tools";

    base = collapseWhitespace(base);

    var suffix = pathContextSuffix((window.location && window.location.pathname) ? window.location.pathname : "");
    var combined = base + suffix;

    combined = collapseWhitespace(combined);
    combined = preserveAcronyms(combined);
    combined = truncate(combined, 80);

    return combined;
  }

  function copyText(text) {
    if (window.NSB_UTILS && typeof window.NSB_UTILS.copyToClipboard === "function") {
      return window.NSB_UTILS.copyToClipboard(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function toast(msg) {
    if (window.NSB_TOAST && typeof window.NSB_TOAST.show === "function") {
      window.NSB_TOAST.show(msg);
    }
  }

  function pulse(btnEl) {
    if (!btnEl) return;
    btnEl.classList.remove("btn-copied");
    void btnEl.offsetWidth;
    btnEl.classList.add("btn-copied");
    window.setTimeout(function () {
      btnEl.classList.remove("btn-copied");
    }, 260);
  }

  var CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

  function render(containerEl, options) {
    if (!containerEl) return;

    var opts = options || {};
    var url = opts.url || buildPageUrl(opts);

    // Anchor text: only use opts.anchorText if explicitly provided, otherwise compute
    var anchorText = opts.anchorText ? String(opts.anchorText) : buildDefaultAnchorText(url);

    // Keep visible but collapsed by default as Share
    var title = opts.title || "Share";
    var note = opts.note ? '<p class="link-note">' + esc(opts.note) + "</p>" : "";

    var showEmbed = !!opts.showEmbed;
    var embedHtml = opts.embedHtml || "";

    var contentId = "ltt-body-" + Math.random().toString(16).slice(2);
    var defaultCollapsed = (opts.defaultCollapsed !== false); // default true

    var embedSection = "";
    if (showEmbed && embedHtml) {
      embedSection =
        '<div class="link-row">' +
          '<span class="link-label">Embed</span>' +
          '<code class="link-code" data-ltt-embed>' + esc(embedHtml) + "</code>" +
        "</div>" +
        '<div class="link-actions">' +
          '<button type="button" class="btn btn-secondary btn-sm" data-ltt-copy="embed">Copy embed</button>' +
        "</div>";
    }

    var collapsedClass = defaultCollapsed ? " link-body is-collapsed" : " link-body";
    var ariaExpanded = defaultCollapsed ? "false" : "true";
    var cardDataOpen = defaultCollapsed ? "" : ' data-open="1"';

    containerEl.innerHTML =
      '<div class="card link-card"' + cardDataOpen + '>' +
        '<button type="button" class="btn btn-secondary btn-sm share-toggle" data-ltt-toggle aria-expanded="' + ariaExpanded + '" aria-controls="' + esc(contentId) + '">' +
          '<span class="share-toggle-label">' + esc(title) + "</span>" +
          '<span class="share-toggle-icon" aria-hidden="true">' + CHEVRON_SVG + "</span>" +
        "</button>" +
        '<div id="' + esc(contentId) + '" class="' + collapsedClass.trim() + '">' +
          note +
          '<div class="link-row">' +
            '<span class="link-label">Anchor text</span>' +
            '<span class="link-code" data-ltt-anchor>' + esc(anchorText) + "</span>" +
          "</div>" +
          '<div class="link-row">' +
            '<span class="link-label">URL</span>' +
            '<span class="link-code" data-ltt-url>' + esc(url) + "</span>" +
          "</div>" +
          '<div class="link-actions">' +
            '<button type="button" class="btn btn-secondary btn-sm" data-ltt-copy="url">Copy URL</button>' +
            '<button type="button" class="btn btn-secondary btn-sm" data-ltt-copy="anchor">Copy anchor text</button>' +
          "</div>" +
          embedSection +
        "</div>" +
      "</div>";

    var bodyEl = document.getElementById(contentId);
    var cardEl = containerEl.querySelector(".link-card");

    containerEl.onclick = function (e) {
      var toggleBtn = e.target.closest("[data-ltt-toggle]");
      if (toggleBtn && bodyEl) {
        var isCollapsed = bodyEl.classList.contains("is-collapsed");
        if (isCollapsed) {
          bodyEl.classList.remove("is-collapsed");
          toggleBtn.setAttribute("aria-expanded", "true");
          if (cardEl) cardEl.setAttribute("data-open", "1");
        } else {
          bodyEl.classList.add("is-collapsed");
          toggleBtn.setAttribute("aria-expanded", "false");
          if (cardEl) cardEl.removeAttribute("data-open");
        }
        return;
      }

      var btn = e.target.closest("[data-ltt-copy]");
      if (!btn) return;

      var type = btn.getAttribute("data-ltt-copy");
      var text =
        type === "url" ? url :
        type === "anchor" ? anchorText :
        type === "embed" ? embedHtml :
        "";

      if (!text) return;

      copyText(text)
        .then(function () {
          pulse(btn);
          toast("Copied!");
        })
        .catch(function () {
          pulse(btn);
          toast("Copy failed. Select and copy manually.");
        });
    };
  }

  window.NSB_LINK_TO_THIS = { render: render };
})();
