/**
 * One-off: move explainer sections below tool workspace on tool pages.
 * Skips pages without `div.card`, pages already relayouted, or link-only pages.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PRO_HUB =
  '<section class="pro-section"><h3>NSB Pro</h3><p>Unlimited generator runs while Pro is active, calculator presets, and CSV import/export on supported tools. Pick monthly or lifetime in the upgrade modal.</p><button type="button" class="btn btn-pro" onclick="window.NSB_OPEN_UPGRADE && window.NSB_OPEN_UPGRADE()">Upgrade</button></section>';

const PRO_PRESETS_EXTRA = (dataAttrs) =>
  `<section id="nsb-pro-section" class="pro-section"${dataAttrs}><h3>Pro</h3><p>Save presets, export or import full CSV schedules (new exports include your inputs). Unlimited calculator use. Monthly or lifetime in the modal.</p><button type="button" class="btn btn-pro" onclick="window.NSB_OPEN_UPGRADE && window.NSB_OPEN_UPGRADE()">Upgrade</button></section>`;

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (name === "node_modules" || name.startsWith(".")) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else if (name === "index.html" && p.includes(`${path.sep}tools${path.sep}`)) acc.push(p);
  }
  return acc;
}

function normalizePro(workspace) {
  workspace = workspace.replace(/<section id="nsb-pro-section"[^>]*>[\s\S]*?<\/section>/g, (full) => {
    const m = full.match(/data-nsb-presets-tool="([^"]*)"/);
    const extra = m ? ` data-nsb-presets-tool="${m[1]}"` : "";
    return PRO_PRESETS_EXTRA(extra);
  });
  workspace = workspace.replace(/<section class="pro-section">[\s\S]*?<\/section>/g, PRO_HUB);
  return workspace;
}

function relayout(html) {
  if (html.includes('class="tool-workspace"')) return html;
  const mainOpen = html.indexOf('<main class="layout">');
  if (mainOpen === -1) return html;
  const mainClose = html.indexOf("</main>", mainOpen);
  if (mainClose === -1) return html;
  const before = html.slice(0, mainOpen);
  const main = html.slice(mainOpen, mainClose);
  const after = html.slice(mainClose);

  const idxFirstSec = main.indexOf('<section class="section">');
  let idxCard = main.indexOf("\n    <div class=\"card\"");
  if (idxCard === -1) idxCard = main.indexOf('<div class="card"');
  if (idxFirstSec === -1 || idxCard === -1 || idxCard < idxFirstSec) return html;

  const headerPart = main.slice(0, idxFirstSec).trimEnd();
  const guidePart = main.slice(idxFirstSec, idxCard).trim();
  let rest = main.slice(idxCard);
  const inj = "\n    <div id=\"nsb-tool-sections\"";
  const injIdx = rest.indexOf(inj);
  let workspace;
  let afterWs;
  if (injIdx !== -1) {
    workspace = rest.slice(0, injIdx).trimEnd();
    afterWs = rest.slice(injIdx);
  } else {
    workspace = rest.trimEnd();
    afterWs = "";
  }
  workspace = normalizePro(workspace);

  const jump =
    "\n    <p class=\"tool-jump-guide\"><a href=\"#tool-guide\">How it works &amp; tips</a></p>";
  const newMain =
    headerPart +
    jump +
    "\n    <div class=\"tool-workspace\">\n" +
    workspace +
    "\n    </div>\n    <article id=\"tool-guide\" class=\"tool-guide\">\n" +
    guidePart +
    "\n    </article>" +
    afterWs;

  return before + newMain + after;
}

let updated = 0;
for (const file of walk(path.join(ROOT, "tools"))) {
  const html = fs.readFileSync(file, "utf8");
  const next = relayout(html);
  if (next !== html) {
    fs.writeFileSync(file, next, "utf8");
    updated++;
    console.log("updated", path.relative(ROOT, file));
  }
}
console.log("done,", updated, "files");
