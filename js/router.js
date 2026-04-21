// ─────────────────────────────────────────────
//  ROUTER
//  Manages which page is visible and triggers
//  data loads per page via page controllers.
// ─────────────────────────────────────────────

import { loadHomePage }        from "./pages/home.js";
import { loadListenPage }      from "./pages/listen.js";
import { loadShowsPage }       from "./pages/shows.js";
import { loadShowDetailPage }  from "./pages/show-detail.js";
import { loadHostsPage }       from "./pages/hosts.js";
import { loadHostProfilePage } from "./pages/host-profile.js";
import { loadBlogPage }        from "./pages/blog.js";
import { loadArticlePage }     from "./pages/article.js";
import { loadPromotionsPage }  from "./pages/promotions.js";
import { loadAboutPage }       from "./pages/about.js";
import { loadContactPage }     from "./pages/contact.js";
import { triggerReveals }      from "./renderers.js";

const pageMap = {
  "home":         "page-home",
  "listen":       "page-listen",
  "shows":        "page-shows",
  "show-detail":  "page-show-detail",
  "hosts":        "page-hosts",
  "host-profile": "page-host-profile",
  "blog":         "page-blog",
  "article":      "page-article",
  "promotions":   "page-promotions",
  "about":        "page-about",
  "contact":      "page-contact",
};

const loaders = {
  "home":         loadHomePage,
  "listen":       loadListenPage,
  "shows":        loadShowsPage,
  "show-detail":  loadShowDetailPage,
  "hosts":        loadHostsPage,
  "host-profile": loadHostProfilePage,
  "blog":         loadBlogPage,
  "article":      loadArticlePage,
  "promotions":   loadPromotionsPage,
  "about":        loadAboutPage,
  "contact":      loadContactPage,
};

const navIds = ["listen","shows","hosts","blog","promotions","about","contact"];
let currentPage = null;

function renderPage(id, contextId = null, pushState = true) {
  if (!pageMap[id]) { console.warn("Unknown page:", id); return; }

  // Hide all
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  // Show target
  const target = document.getElementById(pageMap[id]);
  if (!target) return;
  target.classList.add("active");

  // Update nav
  navIds.forEach(n => {
    const el = document.getElementById("nav-" + n);
    if (el) el.classList.toggle("active", n === id);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Load data
  const loader = loaders[id];
  if (loader) {
    loader(contextId).then(() => {
      triggerReveals(target);
    }).catch(err => console.error(`Error loading page [${id}]:`, err));
  } else {
    triggerReveals(target);
  }

  currentPage = id;

  // Push browser history so native back button works
  if (pushState) {
    const state = { page: id, contextId };
    const url   = contextId ? `#${id}/${contextId}` : `#${id}`;
    history.pushState(state, "", url);
  }

  // Close mobile menu
  document.getElementById("mobileMenu")?.classList.remove("open");
}

export function showPage(id, contextId = null) {
  renderPage(id, contextId, true);
}

// Handle native back/forward button
window.addEventListener("popstate", e => {
  if (e.state?.page) {
    renderPage(e.state.page, e.state.contextId, false);
  } else {
    renderPage("home", null, false);
  }
});

export function getCurrentPage() { return currentPage; }
