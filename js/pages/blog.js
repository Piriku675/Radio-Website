// ── BLOG PAGE CONTROLLER ──────────────────────
import { getAllArticles }  from "../data-service.js";
import { renderBlogPage }  from "../renderers.js";

export async function loadBlogPage() {
  const articles = await getAllArticles();
  renderBlogPage(articles);
}
