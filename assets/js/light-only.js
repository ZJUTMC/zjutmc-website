// Run in <head> after Blowfish initializes appearance, before the page paints.
document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "light";
try {
  localStorage.setItem("appearance", "light");
} catch {
  // The page remains light when browser storage is unavailable.
}
