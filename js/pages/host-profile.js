// ── HOST PROFILE PAGE CONTROLLER ──────────────
import { getHostById, getShowById } from "../data-service.js";
import { renderHostProfile }        from "../renderers.js";

export async function loadHostProfilePage(hostId) {
  if (!hostId) return;
  const host = await getHostById(hostId);
  if (!host) return;

  // Load all shows this host is linked to
  const showPromises = (host.showIds || []).map(id => getShowById(id));
  const shows = (await Promise.all(showPromises)).filter(Boolean);

  renderHostProfile(host, shows);
}
