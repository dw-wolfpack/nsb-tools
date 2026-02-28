/**
 * Minimal document/window stubs for link-to-this tests.
 * No external DOM libraries; just enough to execute render() and inspect innerHTML.
 */

/**
 * Create a mock element with classList, setAttribute, removeAttribute.
 * @returns {Object}
 */
function createMockElement() {
  const classes = new Set();
  const attrs = {};
  return {
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); },
      get value() { return Array.from(classes).join(" "); },
    },
    setAttribute(name, value) { attrs[name] = value; },
    removeAttribute(name) { delete attrs[name]; },
    getAttribute(name) { return attrs[name]; },
  };
}

/**
 * Create minimal document/window stubs for link-to-this tests.
 * @param {Object} opts - { h1Text?, title?, pathname?, hostname?, origin?, canonicalHref? }
 * @returns {{ document: Object, window: Object, container: { innerHTML: string } }}
 */
export function createDomStub(opts = {}) {
  const o = opts;

  const mockCard = createMockElement();
  const container = {
    innerHTML: "",
    querySelector() {
      return mockCard;
    },
    get onclick() { return this._onclick; },
    set onclick(fn) { this._onclick = fn; },
  };

  const canonicalHref = o.canonicalHref ?? "";
  const canonicalLink = canonicalHref
    ? { href: canonicalHref }
    : null;

  const h1Text = o.h1Text ?? "";
  const h1List = h1Text
    ? {
        length: 1,
        0: { textContent: h1Text },
        item(i) { return this[i] ?? null; },
      }
    : { length: 0, item() { return null; } };

  const mockEl = createMockElement();

  const document = {
    title: o.title ?? "",
    querySelector(sel) {
      if (/link\[rel="canonical"\]/i.test(sel)) return canonicalLink;
      return null;
    },
    querySelectorAll(sel) {
      if (/^h1$/i.test(sel)) return h1List;
      return { length: 0, item() { return null; } };
    },
    getElementById() {
      return mockEl;
    },
    createElement() {
      return createMockElement();
    },
    body: { appendChild() {}, removeChild() {} },
  };

  const pathname = o.pathname ?? "/";
  const hostname = o.hostname ?? "localhost";
  const origin = o.origin ?? "https://tools.nextstepsbeyond.online";

  const window = {
    location: {
      pathname,
      hostname,
      origin,
      search: "",
      href: origin + pathname,
    },
    NSB_UTILS: {},
    NSB_TOAST: { show() {} },
    setTimeout: (fn, ms) => (typeof fn === "function" ? setTimeout(fn, ms) : null),
  };

  return { document, window, container };
}
