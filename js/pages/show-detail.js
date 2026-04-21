// ── SHOW DETAIL PAGE CONTROLLER ───────────────
import { getShowById, getHostsByShowId } from "../data-service.js";
import { renderShowDetail } from "../renderers.js";

export async function loadShowDetailPage(showId) {
  if (!showId) return;
  const [show, hosts] = await Promise.all([
    getShowById(showId),
    getHostsByShowId(showId),
  ]);
  renderShowDetail(show, hosts);
}
