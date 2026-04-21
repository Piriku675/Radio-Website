// ── ARTICLE PAGE CONTROLLER ───────────────────
import { getArticleById } from "../data-service.js";
import { renderArticle }  from "../renderers.js";

export async function loadArticlePage(articleId) {
  if (!articleId) return;
  const article = await getArticleById(articleId);
  renderArticle(article);
}
