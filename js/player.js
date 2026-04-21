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

function setPlaying(v) {
  playing = v;
  const icon = v ? "⏸" : "▶";
  if (playBtn) playBtn.textContent  = icon;
  if (miniBtn) miniBtn.textContent  = icon;
  if (eq)      eq.classList.toggle("playing", v);
  if (miniEq)  miniEq.classList.toggle("playing", v);
}

function startPlay() {
  if (!audio) return;
  const src = audio.querySelector("source")?.src;
  if (src) audio.src = src;
  audio.play().catch(() => {});
  setPlaying(true);
}

function stopPlay() {
  if (!audio) return;
  audio.pause();
  setPlaying(false);
  clearTimeout(reconnectTimer);
}

function toggle() { playing ? stopPlay() : startPlay(); }

// Wiring
if (playBtn)   playBtn.addEventListener("click", toggle);
if (miniBtn)   miniBtn.addEventListener("click", e => { e.stopPropagation(); toggle(); });
if (recordBtn) recordBtn.addEventListener("click", () => recordBtn.classList.toggle("active"));

if (audio) {
  audio.addEventListener("error", () => {
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

// Dock mini player above footer when footer becomes visible
const footer = document.querySelector("footer");
if (footer && miniOuter) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      miniOuter.style.position = "absolute";
      miniOuter.style.top      = `${footerTop - miniOuter.offsetHeight}px`;
      miniOuter.style.bottom   = "auto";
    } else {
      miniOuter.style.position = "";
      miniOuter.style.top      = "";
      miniOuter.style.bottom   = "";
    }
  }, { threshold: 0 }).observe(footer);
}

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
