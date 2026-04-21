// ── PROMOTIONS PAGE CONTROLLER ────────────────
import {
  getCurrentPromotion, getPastPromotions, getRecentWinners
} from "../data-service.js";
import { renderPromotionsPage } from "../renderers.js";

export async function loadPromotionsPage() {
  const [current, past, winners] = await Promise.all([
    getCurrentPromotion(),
    getPastPromotions(),
    getRecentWinners(5),
  ]);
  renderPromotionsPage(current, past, winners);
}
