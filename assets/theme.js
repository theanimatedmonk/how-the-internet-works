/**
 * Light / dark theme toggle — persists to localStorage.
 */
(function () {
  var STORAGE_KEY = "how-internet-works:theme";
  var THEME_LINK_ID = "docsify-theme";

  var THEMES = {
    dark: {
      sheet:
        "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css",
      label: "Light",
      title: "Switch to light mode",
    },
    light: {
      sheet:
        "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css",
      label: "Dark",
      title: "Switch to dark mode",
    },
  };

  function storedTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function setStylesheet(theme) {
    var link = document.getElementById(THEME_LINK_ID);
    if (link) link.href = THEMES[theme].sheet;
  }

  function applyTheme(theme, save) {
    document.documentElement.setAttribute("data-theme", theme);
    setStylesheet(theme);
    if (save !== false) localStorage.setItem(STORAGE_KEY, theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var next = theme === "dark" ? "light" : "dark";
      btn.textContent = THEMES[theme].label;
      btn.setAttribute("aria-label", THEMES[theme].title);
      btn.dataset.nextTheme = next;
    }
  }

  function toggleTheme() {
    var current =
      document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark", true);
  }

  function mountToggle() {
    if (document.querySelector(".theme-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.addEventListener("click", toggleTheme);

    var sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.insertBefore(btn, sidebar.firstChild);
    } else {
      btn.classList.add("theme-toggle--fixed");
      document.body.appendChild(btn);
    }

    var theme =
      document.documentElement.getAttribute("data-theme") || storedTheme();
    applyTheme(theme, false);
  }

  window.__applySiteTheme = applyTheme;

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function (
    hook
  ) {
    hook.mounted(mountToggle);
    hook.ready(mountToggle);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle);
  } else {
    setTimeout(mountToggle, 0);
  }
})();
