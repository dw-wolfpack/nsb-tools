/**
 * SEO Health Check - Client-side validation
 * Run from /seo-health/ to validate SEO before deploy.
 */
(function () {
  "use strict";

  const BASE = "https://tools.nextstepsbeyond.online";

  function parseHTML(html) {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  function getMeta(doc, nameOrProp) {
    const byName = doc.querySelector(`meta[name="${nameOrProp}"]`);
    if (byName) return byName.getAttribute("content") || "";
    const byProp = doc.querySelector(`meta[property="${nameOrProp}"]`);
    if (byProp) return byProp.getAttribute("content") || "";
    return "";
  }

  function runPageChecks(doc, pageLabel) {
    const results = [];
    const title = doc.querySelector("title");
    const titleText = title ? title.textContent.trim() : "";
    const desc = getMeta(doc, "description");
    const canonical = doc.querySelector('link[rel="canonical"]');
    const canonicalVal = canonical ? (canonical.getAttribute("href") || "") : "";

    // H1
    const h1s = doc.querySelectorAll("h1");
    const h1Ok = h1s.length === 1;
    results.push({
      id: "h1",
      pass: h1Ok,
      label: "Single H1",
      value: h1Ok ? (h1s[0]?.textContent?.trim().slice(0, 50) || "") : `Found ${h1s.length} H1s`
    });

    // Title
    const titleLen = titleText.length;
    const titleOk = titleLen >= 10 && titleLen <= 70;
    results.push({
      id: "title",
      pass: titleOk,
      label: "Title (10-70 chars)",
      value: titleText ? titleText.slice(0, 70) + (titleText.length > 70 ? "..." : "") : "(missing)"
    });

    // Meta description
    const descLen = desc.length;
    const descOk = descLen >= 50 && descLen <= 160;
    results.push({
      id: "description",
      pass: descOk,
      label: "Meta description (50-160 chars)",
      value: desc ? desc.slice(0, 60) + (desc.length > 60 ? "..." : "") : "(missing)"
    });

    // Canonical
    const canonOk = canonicalVal.startsWith(BASE + "/");
    results.push({
      id: "canonical",
      pass: canonOk,
      label: "Canonical starts with " + BASE + "/",
      value: canonicalVal ? canonicalVal.slice(0, 60) + (canonicalVal.length > 60 ? "..." : "") : "(missing)"
    });

    // OG
    const ogTitle = getMeta(doc, "og:title");
    const ogDesc = getMeta(doc, "og:description");
    const ogUrl = getMeta(doc, "og:url");
    const ogImage = getMeta(doc, "og:image");
    const ogOk = !!(ogTitle && ogDesc && ogUrl && ogImage);
    results.push({
      id: "og",
      pass: ogOk,
      label: "OG tags (title, description, url, image)",
      value: ogOk ? "All present" : [ogTitle ? "title" : "", ogDesc ? "desc" : "", ogUrl ? "url" : "", ogImage ? "image" : ""].filter(Boolean).join(", ") || "missing"
    });

    // Twitter
    const twCard = getMeta(doc, "twitter:card");
    const twTitle = getMeta(doc, "twitter:title");
    const twDesc = getMeta(doc, "twitter:description");
    const twImage = getMeta(doc, "twitter:image");
    const twOk = !!(twCard && twTitle && twDesc && twImage);
    results.push({
      id: "twitter",
      pass: twOk,
      label: "Twitter tags (card, title, description, image)",
      value: twOk ? "All present" : [twCard ? "card" : "", twTitle ? "title" : "", twDesc ? "desc" : "", twImage ? "image" : ""].filter(Boolean).join(", ") || "missing"
    });

    // JSON-LD
    const ldScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    const ldTexts = Array.from(ldScripts).map(s => s.textContent || "").filter(Boolean);
    const ldTypes = [];
    function extractTypes(obj) {
      if (!obj) return;
      if (Array.isArray(obj)) { obj.forEach(extractTypes); return; }
      if (obj["@graph"]) { extractTypes(obj["@graph"]); return; }
      if (obj["@type"]) ldTypes.push(obj["@type"]);
    }
    ldTexts.forEach(t => {
      try {
        const obj = typeof t === "string" ? JSON.parse(t) : t;
        extractTypes(Array.isArray(obj) ? obj : [obj]);
      } catch (e) {}
    });
    const hasSoftware = ldTypes.includes("SoftwareApplication");
    const hasBreadcrumb = ldTypes.includes("BreadcrumbList");
    const isToolPage = pageLabel && pageLabel.toLowerCase().includes("tool");
    const isHomepage = pageLabel && pageLabel.toLowerCase().includes("homepage");
    let ldOk, ldLabel;
    if (isHomepage) {
      ldOk = true;
      ldLabel = "JSON-LD (optional for homepage)";
    } else if (isToolPage) {
      ldOk = hasSoftware && hasBreadcrumb;
      ldLabel = "JSON-LD (SoftwareApplication + BreadcrumbList)";
    } else {
      ldOk = hasBreadcrumb;
      ldLabel = "JSON-LD (BreadcrumbList)";
    }
    results.push({
      id: "jsonld",
      pass: ldOk,
      label: ldLabel,
      value: ldTypes.length ? ldTypes.join(", ") : "(none found)"
    });

    return { pageLabel, results };
  }

  async function fetchSitemap() {
    const res = await fetch("/sitemap.xml");
    const text = await res.text();
    const hasUrlset = text.includes("<urlset");
    const hasRoot = text.includes(BASE + "/");
    const hasCategories = text.includes(BASE + "/categories/");
    const hasTool = /\/tools\/[^/]+\//.test(text);
    const hasFaq = text.includes(BASE + "/faq/");
    const ok = hasUrlset && hasRoot && hasCategories && hasTool && hasFaq;
    return {
      pass: ok,
      label: "Sitemap (urlset, /, /categories/, tool URL, /faq/)",
      value: ok ? "All required URLs present" : [hasUrlset ? "" : "urlset", hasRoot ? "" : "/", hasCategories ? "" : "categories", hasTool ? "" : "tool", hasFaq ? "" : "faq"].filter(Boolean).join(", ") || "OK",
      details: text.slice(0, 200) + "..."
    };
  }

  async function fetchRobots() {
    const res = await fetch("/robots.txt");
    const text = await res.text();
    const hasSitemap = text.includes("Sitemap: " + BASE + "/sitemap.xml");
    return {
      pass: hasSitemap,
      label: "robots.txt contains Sitemap",
      value: hasSitemap ? "Sitemap URL present" : text.slice(0, 80) + "..."
    };
  }

  async function fetchPage(path) {
    const res = await fetch(path);
    return res.text();
  }

  window.NSB_SEO_CHECK = {
    async run() {
      const output = [];
      const pagesToCheck = [
        { path: "/", label: "Homepage" },
        { path: "/updates/", label: "Updates" },
        { path: "/faq/", label: "FAQ" },
        { path: "/tools/username-generator/", label: "Tool (username-generator)" },
        { path: "/categories/social/", label: "Category (social)" }
      ];

      for (const { path, label } of pagesToCheck) {
        try {
          const html = await fetchPage(path);
          const doc = parseHTML(html);
          const pageResult = runPageChecks(doc, label);
          output.push(pageResult);
        } catch (err) {
          output.push({
            pageLabel: label,
            results: [],
            error: err.message || "Fetch failed"
          });
        }
      }

      try {
        const sitemapResult = await fetchSitemap();
        output.push({ pageLabel: "Sitemap", results: [sitemapResult] });
      } catch (err) {
        output.push({ pageLabel: "Sitemap", results: [], error: err.message });
      }

      try {
        const robotsResult = await fetchRobots();
        output.push({ pageLabel: "robots.txt", results: [robotsResult] });
      } catch (err) {
        output.push({ pageLabel: "robots.txt", results: [], error: err.message });
      }

      return output;
    }
  };
})();
