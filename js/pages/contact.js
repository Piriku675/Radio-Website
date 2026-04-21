// ── CONTACT PAGE CONTROLLER ───────────────────
import { getContactInfo }    from "../data-service.js";
import { renderContactPage } from "../renderers.js";

export async function loadContactPage() {
  const contact = await getContactInfo();
  renderContactPage(contact);
}
