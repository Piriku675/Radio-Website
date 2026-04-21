// ─────────────────────────────────────────────
//  DATA SERVICE
//  All Firestore reads are centralised here.
//  Every function returns a plain JS object/array
//  so the renderers stay decoupled from Firebase.
// ─────────────────────────────────────────────

import { db } from "./firebase-config.js";
import {
  doc, getDoc, getDocs,
  collection, query, where,
  orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── helpers ──────────────────────────────────
const col  = (...segs) => collection(db, ...segs);
const ref  = (...segs) => doc(db, ...segs);

async function fetchDoc(path) {
  const snap = await getDoc(ref(...path.split("/")));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

async function fetchCollection(colPath, ...constraints) {
  const q    = query(col(...colPath.split("/")), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ── STATION ───────────────────────────────────
export async function getStationConfig() {
  return fetchDoc("config/station");
}

// ── LIVE STREAM ───────────────────────────────
export async function getLiveStream() {
  return fetchDoc("config/liveStream");
}

// ── PROMO STRIP ───────────────────────────────
export async function getActivePromoStrip() {
  const items = await fetchCollection("promoStrip",
    where("active", "==", true),
    orderBy("order", "asc"),
    limit(1)
  );
  return items[0] || null;
}

// ── SHOWS ─────────────────────────────────────
export async function getAllShows() {
  return fetchCollection("shows", orderBy("order", "asc"));
}

export async function getShowById(id) {
  return fetchDoc(`shows/${id}`);
}

export async function getFeaturedShow() {
  const items = await fetchCollection("shows",
    where("featured", "==", true),
    limit(1)
  );
  return items[0] || null;
}

// ── HOSTS ─────────────────────────────────────
export async function getAllHosts() {
  return fetchCollection("hosts", orderBy("order", "asc"));
}

export async function getHostById(id) {
  return fetchDoc(`hosts/${id}`);
}

export async function getHostsByShowId(showId) {
  return fetchCollection("hosts", where("showIds", "array-contains", showId));
}

// ── SCHEDULE ──────────────────────────────────
export async function getTodaySchedule() {
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const today = days[new Date().getDay()];
  return fetchCollection("schedule",
    where("days", "array-contains", today),
    orderBy("startHour", "asc")
  );
}

export async function getFullSchedule() {
  return fetchCollection("schedule", orderBy("startHour", "asc"));
}

// ── BLOG ──────────────────────────────────────
export async function getLatestArticles(n = 3) {
  return fetchCollection("articles",
    where("published", "==", true),
    orderBy("publishedAt", "desc"),
    limit(n)
  );
}

export async function getAllArticles() {
  return fetchCollection("articles",
    where("published", "==", true),
    orderBy("publishedAt", "desc")
  );
}

export async function getArticleById(id) {
  return fetchDoc(`articles/${id}`);
}

// ── PROMOTIONS ────────────────────────────────
export async function getCurrentPromotion() {
  const items = await fetchCollection("promotions",
    where("status", "==", "active"),
    orderBy("endsAt", "asc"),
    limit(1)
  );
  return items[0] || null;
}

export async function getPastPromotions() {
  return fetchCollection("promotions",
    where("status", "==", "ended"),
    orderBy("endsAt", "desc")
  );
}

export async function getRecentWinners(n = 5) {
  return fetchCollection("winners",
    orderBy("announcedAt", "desc"),
    limit(n)
  );
}

// ── FACEBOOK FEED ─────────────────────────────
export async function getFacebookPosts(n = 2) {
  return fetchCollection("facebookFeed",
    orderBy("postedAt", "desc"),
    limit(n)
  );
}

// ── ABOUT ─────────────────────────────────────
export async function getAboutContent() {
  return fetchDoc("config/about");
}

// ── CONTACT ───────────────────────────────────
export async function getContactInfo() {
  return fetchDoc("config/contact");
}

// ── REAL-TIME: live stream status ─────────────
export function watchLiveStream(callback) {
  return onSnapshot(ref("config/liveStream"), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
}
