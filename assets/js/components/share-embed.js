/**
 * NSB Tools - Share & Embed
 * Share link, citation, iframe embed for backlink hooks.
 */
(function () {
  "use strict";

  const BASE = "https://tools.nextstepsbeyond.online";

  function encodeParams(obj) {
    return window.NSB_UTILS && window.NSB_UTILS.encodeParams ? window.NSB_UTILS.encodeParams(obj) : "";
  }

  window.NSB_SHARE_EMBED = {
    shareUrl(slug, params) {
      const q = encodeParams(params || {});
      return BASE + "/tools/" + slug + "/" + (q ? "?" + q : "");
    },

    buildShareURL(slug, params) {
      return this.shareUrl(slug, params || {});
    },

    citationMarkdown(slug, toolName) {
      return "Used NSB Tools " + (toolName || slug) + " calculator: " + BASE + "/tools/" + slug + "/";
    },

    embedCode(slug, params) {
      const q = encodeParams(params || {});
      const src = BASE + "/embed/" + slug + "/" + (q ? "?" + q : "");
      return '<iframe src="' + src + '" loading="lazy" style="width:100%;max-width:720px;height:720px;border:1px solid rgba(255,255,255,0.1);border-radius:12px;"></iframe>\n<div style="font-size:12px;margin-top:6px;">Calculator by <a href="' + BASE + '/tools/' + slug + '/">NSB Tools</a></div>';
    },

    render(container, options) {
      const slug = options.slug || "";
      const toolName = options.toolName || slug;
      const params = options.params || {};
      const shareUrl = this.shareUrl(slug, params);
      const citation = this.citationMarkdown(slug, toolName);
      const embed = this.embedCode(slug, params);

      const section = document.createElement("section");
      section.className = "share-embed-section";
      section.innerHTML = '<h3>Share &amp; Embed</h3>' +
        '<div class="form-group"><label>Share link</label><div class="share-row">' +
        '<input type="text" class="share-input" readonly>' +
        '<button type="button" class="btn btn-secondary nsb-copy-share">Copy link</button></div></div>' +
        '<div class="form-group"><label>Copy citation</label><div class="share-row">' +
        '<textarea class="share-textarea" readonly rows="2"></textarea>' +
        '<button type="button" class="btn btn-secondary nsb-copy-citation">Copy citation</button></div></div>' +
        '<div class="form-group"><label>Embed this calculator</label><div class="share-row">' +
        '<textarea class="share-embed-code" readonly rows="4"></textarea>' +
        '<button type="button" class="btn btn-secondary nsb-copy-embed">Copy embed code</button></div></div>' +
        '</section>';
      section.querySelector(".share-input").value = shareUrl;
      section.querySelector(".share-textarea").value = citation;
      section.querySelector(".share-embed-code").value = embed;

      const el = typeof container === "string" ? document.querySelector(container) : container;
      if (el) {
        el.innerHTML = "";
        el.appendChild(section);
        const copyShare = section.querySelector(".nsb-copy-share");
        const copyCitation = section.querySelector(".nsb-copy-citation");
        const copyEmbed = section.querySelector(".nsb-copy-embed");
        const shareInput = section.querySelector(".share-input");
        const citationText = section.querySelector(".share-textarea");
        const embedText = section.querySelector(".share-embed-code");

        if (copyShare && shareInput) {
          copyShare.addEventListener("click", function () {
            if (window.NSB_UTILS) {
              window.NSB_UTILS.copyToClipboard(shareInput.value).then(function (ok) {
                if (ok && window.NSB_TOAST) window.NSB_TOAST.show("Link copied");
              });
            }
          });
        }
        if (copyCitation && citationText) {
          copyCitation.addEventListener("click", function () {
            if (window.NSB_UTILS) {
              window.NSB_UTILS.copyToClipboard(citationText.value).then(function (ok) {
                if (ok && window.NSB_TOAST) window.NSB_TOAST.show("Citation copied");
              });
            }
          });
        }
        if (copyEmbed && embedText) {
          copyEmbed.addEventListener("click", function () {
            if (window.NSB_UTILS) {
              window.NSB_UTILS.copyToClipboard(embedText.value).then(function (ok) {
                if (ok && window.NSB_TOAST) window.NSB_TOAST.show("Embed code copied");
              });
            }
          });
        }
      }
    },

    updateParams(container, options) {
      const slug = options.slug || "";
      const params = options.params || {};
      const shareUrl = this.shareUrl(slug, params);
      const embed = this.embedCode(slug, params);
      const el = typeof container === "string" ? document.querySelector(container) : container;
      if (!el) return;
      const shareInput = el.querySelector(".share-input");
      const embedText = el.querySelector(".share-embed-code");
      if (shareInput) shareInput.value = shareUrl;
      if (embedText) embedText.value = embed;
    }
  };
})();
