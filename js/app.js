// ─────────────────────────────────────────────
//  APP ENTRY POINT
//  Bootstraps the app: theme, nav, initial page.
// ─────────────────────────────────────────────

import { showPage }        from "./router.js";
import { initMiniPlayerObserver } from "./player.js";
import { getStationConfig } from "./data-service.js";
import { renderStationConfig, triggerReveals } from "./renderers.js";

// ── THEME ─────────────────────────────────────
const html        = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
let   darkMode    = true;

themeToggle?.addEventListener("click", () => {
  darkMode = !darkMode;
  html.setAttribute("data-theme", darkMode ? "dark" : "light");
  if (themeToggle) themeToggle.textContent = darkMode ? "☀️" : "🌙";
});

// ── HAMBURGER ─────────────────────────────────
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu   = document.getElementById("mobileMenu");
hamburgerBtn?.addEventListener("click", () => mobileMenu?.classList.toggle("open"));

// ── MODAL ─────────────────────────────────────
const overlay = document.getElementById("hostOverlay");
overlay?.addEventListener("click", e => {
  if (e.target === overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ── HOST CARD on Listen page ──────────────────
// (click handler is wired in renderers.js / renderListenLiveHost)

// ── INIT ──────────────────────────────────────
async function init() {
  // Load global station config (logo, footer text)
  const config = await getStationConfig();
  renderStationConfig(config);

  // Boot to Listen Live page
  showPage("listen");
  initMiniPlayerObserver();
}

init();

// Expose showPage globally so onclick attributes in HTML work
window.showPage = showPage;
