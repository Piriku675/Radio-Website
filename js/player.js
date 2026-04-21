// ─────────────────────────────────────────────
//  AUDIO PLAYER
//  Manages play/pause, mini-player, equalizer.
//  Fully decoupled from Firestore.
// ─────────────────────────────────────────────

let playing     = false;
let reconnectTimer;

const audio     = document.getElementById("stream");
const playBtn   = document.getElementById("playBtn");
const miniBtn   = document.getElementById("miniPlayBtn");
const recordBtn = document.getElementById("recordBtn");
const eq        = document.getElementById("equalizer");
const miniEq    = document.getElementById("miniEq");
const miniOuter = document.getElementById("miniOuter");
const miniPlayer= document.getElementById("miniPlayer");

function setBuffering(v) {
  if (playBtn) playBtn.classList.toggle("buffering", v);
  if (miniBtn) miniBtn.classList.toggle("buffering", v);
  if (eq)      eq.classList.toggle("buffering", v);
  if (miniEq)  miniEq.classList.toggle("buffering", v);
}

function setPlaying(v) {
  playing = v;
  const icon = v ? "⏸" : "▶";
  if (playBtn) playBtn.textContent  = icon;
  if (miniBtn) miniBtn.textContent  = icon;
  if (eq)      eq.classList.toggle("playing", v);
  if (miniEq)  miniEq.classList.toggle("playing", v);
  setBuffering(false);
}

function startPlay() {
  if (!audio) return;
  const src = audio.querySelector("source")?.src;
  if (src) audio.src = src;
  setBuffering(true);
  if (playBtn) playBtn.textContent = "";
  if (miniBtn) miniBtn.textContent = "";
  audio.play().catch(() => { setBuffering(false); });
}

function stopPlay() {
  if (!audio) return;
  audio.pause();
  setPlaying(false);
  setBuffering(false);
  clearTimeout(reconnectTimer);
}

function toggle() { playing ? stopPlay() : startPlay(); }

// Wiring
if (playBtn)   playBtn.addEventListener("click", toggle);
if (miniBtn)   miniBtn.addEventListener("click", e => { e.stopPropagation(); toggle(); });
if (recordBtn) recordBtn.addEventListener("click", () => recordBtn.classList.toggle("active"));

if (audio) {
  audio.addEventListener("playing", () => {
    playing = true;
    setPlaying(true);
  });
  audio.addEventListener("waiting", () => {
    if (playing) setBuffering(true);
  });
  audio.addEventListener("error", () => {
    setBuffering(false);
    if (playing) reconnectTimer = setTimeout(startPlay, 4000);
  });
  audio.addEventListener("ended", () => {
    if (playing) reconnectTimer = setTimeout(startPlay, 3000);
  });
}

// Mini player visibility (only on listen page)
export function initMiniPlayerObserver() {
  const wrap = document.getElementById("mainPlayerWrap");
  if (!wrap || !miniOuter) return;
  new IntersectionObserver(([e]) => {
    miniOuter.classList.toggle("visible", !e.isIntersecting);
  }, { threshold: 0 }).observe(wrap);
}

// Dock mini player above footer when footer scrolls into view
function updateMiniPlayerDock() {
  if (!miniOuter || !miniOuter.classList.contains("visible")) return;

  const activePage = document.querySelector(".page.active");
  if (!activePage) return;

  const footer = activePage.querySelector("footer");
  if (!footer) return;

  const footerRect   = footer.getBoundingClientRect();
  const playerHeight = miniOuter.offsetHeight;
  const viewHeight   = window.innerHeight;

  if (footerRect.top < viewHeight) {
    // Footer is visible — pin player just above it
    const gap = viewHeight - footerRect.top;
    miniOuter.style.transform = `translateY(-${gap}px)`;
  } else {
    // Footer out of view — stick to bottom normally
    miniOuter.style.transform = "translateY(0)";
  }
}

window.addEventListener("scroll", updateMiniPlayerDock, { passive: true });

if (miniPlayer) {
  miniPlayer.addEventListener("click", () => {
    import("./router.js").then(({ showPage }) => {
      showPage("listen");
      setTimeout(() => {
        document.getElementById("mainPlayerWrap")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    });
  });
}

export { setPlaying, toggle };
