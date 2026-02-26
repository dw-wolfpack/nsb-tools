/**
 * NSB Tools - Router helper (active nav)
 */

(function () {
  "use strict";

  function getActiveNav() {
    const path = window.location.pathname;
    if (path === "/" || path === "/index.html" || path === "") return "home";
    if (path.startsWith("/categories")) return "categories";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/changelog")) return "changelog";
    return "";
  }

  window.NSB_ROUTER = {
    getActiveNav
  };
})();
