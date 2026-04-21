// ── HOME PAGE CONTROLLER ──────────────────────
import {
  getActivePromoStrip, getLiveStream, getFeaturedShow,
  getLatestArticles, getTodaySchedule, 
  getCurrentPromotion, getStationConfig
} from "../data-service.js";
import {
  renderPromoStrip, renderCompactPlayer, renderCurrentShow,
  renderHomeBlog, renderHomeSchedule, renderFacebookPosts,
  renderPromoHighlight, renderFacebookFeed, triggerReveals
} from "../renderers.js";

export async function loadHomePage() {
  const [promo, stream, show, articles, schedule, posts, promotion, config] = await Promise.all([
    getActivePromoStrip(),
    getLiveStream(),
    getFeaturedShow(),
    getLatestArticles(3),
    getTodaySchedule(),
    getFacebookPosts(2),
    getCurrentPromotion(),
    getStationConfig(),
  ]);

  renderPromoStrip(promo);
  renderCompactPlayer(stream);
  renderCurrentShow(show);
  renderHomeBlog(articles, "home-blog-list");
  renderHomeSchedule(schedule, show?.id);
  renderFacebookFeed(posts, config?.facebook);
  renderPromoHighlight(promotion);
}
