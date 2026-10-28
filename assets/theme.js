/**
 * Light / dark theme + GitHub — top-right icon buttons.
 */
(function () {
  var STORAGE_KEY = "how-internet-works:theme";
  var THEME_LINK_ID = "docsify-theme";
  var GITHUB_URL =
    "https://github.com/theanimatedmonk/how-the-internet-works";

  var THEMES = {
    dark: {
      sheet:
        "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple-dark.css",
      title: "Switch to light mode",
      label: "Light",
    },
    light: {
      sheet:
        "https://cdn.jsdelivr.net/npm/docsify-themeable@0/dist/css/theme-simple.css",
      title: "Switch to dark mode",
      label: "Dark",
    },
  };

  var ICON_SUN =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 18a6 6 0 100-12 6 6 0 000 12zm-1-17h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM1 11h3v2H1v-2zm19 0h3v2h-3v-2z"/>' +
    "</svg>";

  var ICON_MOON =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 3a9 9 0 109 9 8.9 8.9 0 01-1.36-6.87A5.4 5.4 0 0112 3z"/>' +
    "</svg>";

  var ICON_GITHUB =
    '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
    '<path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>' +
    "</svg>";

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

  function themeIcon(theme) {
    return theme === "dark" ? ICON_SUN : ICON_MOON;
  }

  function applyTheme(theme, save) {
    document.documentElement.setAttribute("data-theme", theme);
    setStylesheet(theme);
    if (save !== false) localStorage.setItem(STORAGE_KEY, theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.innerHTML = themeIcon(theme);
      btn.setAttribute("aria-label", THEMES[theme].title);
    }
  }

  function toggleTheme() {
    var current =
      document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark", true);
  }

  function cleanupLegacyChrome() {
    document.querySelectorAll(".sidebar-toolbar").forEach(function (el) {
      el.remove();
    });
    var row = document.querySelector(".sidebar-header-row");
    if (row && row.parentNode) {
      var appName = row.querySelector(".app-name");
      if (appName) row.parentNode.insertBefore(appName, row);
      row.remove();
    }
  }

  function mountFloatingActions() {
    cleanupLegacyChrome();
    if (document.querySelector(".floating-actions")) {
      applyTheme(
        document.documentElement.getAttribute("data-theme") || storedTheme(),
        false
      );
      return;
    }

    var dock = document.createElement("div");
    dock.className = "floating-actions";
    dock.setAttribute("role", "toolbar");
    dock.setAttribute("aria-label", "Site actions");

    var themeBtn = document.createElement("button");
    themeBtn.type = "button";
    themeBtn.className = "icon-btn theme-toggle";
    themeBtn.addEventListener("click", toggleTheme);

    var githubLink = document.createElement("a");
    githubLink.className = "icon-btn github-pill";
    githubLink.href = GITHUB_URL;
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    githubLink.setAttribute("aria-label", "View source on GitHub");
    githubLink.innerHTML = ICON_GITHUB;

    dock.appendChild(themeBtn);
    dock.appendChild(githubLink);
    document.body.appendChild(dock);

    applyTheme(
      document.documentElement.getAttribute("data-theme") || storedTheme(),
      false
    );
  }

  window.__applySiteTheme = applyTheme;

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function (
    hook
  ) {
    hook.mounted(mountFloatingActions);
    hook.ready(mountFloatingActions);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountFloatingActions);
  } else {
    setTimeout(mountFloatingActions, 0);
  }
})();
