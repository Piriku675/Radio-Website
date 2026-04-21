// ── SHOWS PAGE CONTROLLER ─────────────────────
import { getAllShows }  from "../data-service.js";
import { renderShowsGrid } from "../renderers.js";

export async function loadShowsPage() {
  const shows = await getAllShows();
  renderShowsGrid(shows);
}
