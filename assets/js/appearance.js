// Replace Blowfish's appearance controller: this site always uses light mode.
(() => {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.dataset.defaultAppearance = "light";
  root.dataset.autoAppearance = "false";
  root.style.colorScheme = "light";

  try {
    localStorage.setItem("appearance", "light");
  } catch {
    // Rendering also works when browser storage is unavailable.
  }

  document.addEventListener("DOMContentLoaded", () => {
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.content = getComputedStyle(document.body).backgroundColor;
    }

    if (typeof mermaid !== "undefined" && typeof initMermaidLight === "function") {
      initMermaidLight();
      mermaid.run();
    }

    const scroller = document.getElementById("top-scroller");
    const footer = document.getElementById("site-footer");
    if (scroller && footer) {
      scroller.hidden = scroller.getBoundingClientRect().top > footer.getBoundingClientRect().top;
    }
  }, { once: true });
})();
