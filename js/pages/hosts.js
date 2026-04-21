// ── HOSTS PAGE CONTROLLER ─────────────────────
import { getAllHosts }     from "../data-service.js";
import { renderHostsGrid } from "../renderers.js";

export async function loadHostsPage() {
  const hosts = await getAllHosts();
  renderHostsGrid(hosts);
}
