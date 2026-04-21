// ── LISTEN LIVE PAGE CONTROLLER ───────────────
import {
  getActivePromoStrip, getLiveStream, getTodaySchedule,
  getHostById
} from "../data-service.js";
import {
  renderPromoStrip, renderLivePlayer, renderScheduleSection,
  renderListenLiveHost, renderListenFeatures, watchLiveStream
} from "../renderers.js";
import { watchLiveStream as watchStream } from "../data-service.js";

let unsubscribeLive = null;

export async function loadListenPage() {
  // Unsubscribe any previous listener
  if (unsubscribeLive) { unsubscribeLive(); unsubscribeLive = null; }

  const [promo, stream, schedule] = await Promise.all([
    getActivePromoStrip(),
    getLiveStream(),
    getTodaySchedule(),
  ]);

  renderPromoStrip(promo);
  renderLivePlayer(stream);
  renderScheduleSection("listen-schedule-list", schedule, stream?.currentShowId);

  // Load hosts and features from the current show
  if (stream?.currentShowId) {
    const { getShowById } = await import("../data-service.js");
    const show = await getShowById(stream.currentShowId);
    if (show) {
      renderListenFeatures(show.features);
      if (show.hostIds?.length) {
        const host = await getHostById(show.hostIds[0]);
        if (host) renderListenLiveHost(host);
      }
    }
  }

  // Real-time listener for live stream status changes
  unsubscribeLive = watchStream(updatedStream => {
    renderLivePlayer(updatedStream);
  });
}
