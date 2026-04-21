// ── ABOUT PAGE CONTROLLER ─────────────────────
import { getAboutContent }  from "../data-service.js";
import { renderAboutPage }  from "../renderers.js";

export async function loadAboutPage() {
  const about = await getAboutContent();
  renderAboutPage(about);
}
