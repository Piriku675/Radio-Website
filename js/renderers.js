// ─────────────────────────────────────────────
//  RENDERERS
//  Pure functions: data in → HTML string / DOM out.
//  No Firestore imports. No side-effects beyond DOM.
// ─────────────────────────────────────────────

import { showPage } from "./router.js";

// ── UTILITIES ────────────────────────────────

/** Format a Firestore Timestamp or ISO string to readable date */
export function fmtDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Format a Firestore Timestamp to "X hours/days ago" */
export function fmtRelative(ts) {
  if (!ts) return "";
  const d   = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = Date.now() - d.getTime();
  const hrs  = Math.floor(diff / 3600000);
  if (hrs < 1)  return "Just now";
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function el(tag, cls, html = "") {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function setHtml(id, html) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = html;
}

function setEl(id, val, attr = "textContent") {
  const e = document.getElementById(id);
  if (e) e[attr] = val;
}

// ── LOADING SKELETON ─────────────────────────
export function skeleton(lines = 3) {
  return Array.from({ length: lines }, () =>
    `<div style="height:12px;background:var(--bg3);margin-bottom:8px;width:${60 + Math.random() * 35 | 0}%"></div>`
  ).join("");
}

// ── STATION CONFIG ────────────────────────────
export function renderStationConfig(config) {
  if (!config) return;
  document.title = `${config.callSign} ${config.frequency} — ${config.tagline}`;

  const logoEl = document.getElementById("logo-text");
  if (logoEl && config.callSign && config.frequency) {
    const [call, rest] = [config.callSign.slice(0, 2), config.callSign.slice(2)];
    logoEl.innerHTML = `${call}<span>${rest}</span> ${config.frequency}`;
  }

  const footerCopies = document.querySelectorAll(".footer-copy");
  footerCopies.forEach(el => {
    el.textContent = `${config.callSign} ${config.frequency} © ${new Date().getFullYear()}`;
  });
}

// ── PROMO STRIP ───────────────────────────────
export function renderPromoStrip(promo) {
  const strips = document.querySelectorAll(".promo-strip-dynamic");
  strips.forEach(strip => {
    if (!promo) { strip.style.display = "none"; return; }
    strip.style.display = "flex";
    strip.querySelector(".promo-text strong").textContent = promo.title;
    strip.querySelector(".promo-text span").textContent   = promo.subtitle;
    strip.onclick = () => showPage("promotions");
  });
}

// ── LIVE STREAM / PLAYER ──────────────────────
export function renderLivePlayer(stream) {
  if (!stream) return;

  setEl("player-show-name", stream.showName);
  setEl("player-show-tag",  stream.showTagline);
  setEl("player-show-time", stream.timeSlot);

  const onAirBadge = document.getElementById("on-air-badge");
  if (onAirBadge) {
    onAirBadge.style.display = stream.isLive ? "flex" : "none";
  }

  // Player background art
  const bg = document.querySelector(".player-bg");
  if (bg && stream.thumbnailUrl) {
    bg.style.backgroundImage  = `url('${stream.thumbnailUrl}')`;
    bg.style.backgroundSize   = "cover";
    bg.style.backgroundPosition = "center";
  }

  // Stream URL wired to audio element
  const audio = document.getElementById("stream");
  if (audio && stream.streamUrl) {
    audio.querySelector("source").src = stream.streamUrl;
  }

  // Mini player
  setEl("mini-show-name", stream.showName);
}

// ── COMPACT PLAYER (Home) ─────────────────────
export function renderCompactPlayer(stream) {
  if (!stream) return;
  setEl("compact-show-name", stream.showName);
  const thumb = document.getElementById("compact-thumb-img");
  if (thumb && stream.thumbnailUrl) {
    thumb.innerHTML = `<img src="${stream.thumbnailUrl}" alt="${stream.showName}" style="width:100%;height:100%;object-fit:cover;">`;
  }
}

// ── CURRENT SHOW HIGHLIGHT (Home) ────────────
export function renderCurrentShow(show) {
  const card = document.getElementById("current-show-card");
  if (!card || !show) return;
  card.onclick = () => showPage("show-detail", show.id);
  card.querySelector(".cs-name").textContent = show.name;
  card.querySelector(".cs-host").textContent = `with ${show.hostNames?.join(", ") || ""} · ${show.timeSlot}`;
  const art = card.querySelector(".cs-art");
  if (art && show.thumbnailUrl) {
    art.innerHTML = `<img src="${show.thumbnailUrl}" alt="${show.name}" style="width:100%;height:100%;object-fit:cover;position:relative;z-index:0;">`;
  }
}

// ── BLOG LIST (compact, Home) ─────────────────
export function renderHomeBlog(articles, containerId = "home-blog-list") {
  const list = document.getElementById(containerId);
  if (!list) return;
  if (!articles?.length) { list.innerHTML = `<li style="padding:16px;color:var(--muted);font-size:.82rem">No articles yet.</li>`; return; }

  list.innerHTML = articles.map(a => `
    <li class="blog-item reveal" data-article-id="${a.id}" style="cursor:pointer">
      <div class="blog-thumb" style="overflow:hidden">
        ${a.thumbnailUrl
          ? `<img src="${a.thumbnailUrl}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover">`
          : `<span style="font-size:1.4rem">${a.emoji || "📰"}</span>`}
      </div>
      <div class="blog-body">
        <div class="blog-date">${fmtDate(a.publishedAt)}</div>
        <div class="blog-title">${a.title}</div>
        <div class="blog-excerpt">${a.excerpt}</div>
      </div>
    </li>
  `).join("");

  list.querySelectorAll(".blog-item").forEach(item => {
    item.addEventListener("click", () => showPage("article", item.dataset.articleId));
  });
}

// ── HOME SCHEDULE ─────────────────────────────
export function renderHomeSchedule(scheduleItems, currentShowId) {
  const list = document.getElementById("home-schedule-list");
  if (!list) return;
  if (!scheduleItems?.length) { list.innerHTML = ""; return; }

  list.innerHTML = scheduleItems.map(s => {
    const isNow = s.showId === currentShowId;
    return `
      <li class="sched-short-row${isNow ? " current-row" : ""}">
        <span class="sched-short-time">${s.displayTime}</span>
        <span class="sched-short-name">${s.showName}</span>
        ${isNow ? `<span class="sched-short-now">Now</span>` : "<span></span>"}
      </li>`;
  }).join("");
}

// ── FACEBOOK FEED (Home) ──────────────────────
export function renderFacebookFeed(posts, config) {
  const container = document.getElementById("fb-feed-container");
  if (!container) return;

  const header = container.querySelector(".fb-header");
  if (header && config) {
    header.querySelector(".fb-name").textContent    = config.pageName || "WVBZ 98.7";
    header.querySelector(".fb-follow").textContent  = config.followersLabel || "";
  }

  const postsContainer = document.getElementById("fb-posts");
  if (!postsContainer) return;
  postsContainer.innerHTML = (posts || []).map(p => `
    <div class="fb-post">
      <div class="fb-post-text">${p.text}</div>
      <div class="fb-post-date">${fmtRelative(p.postedAt)}</div>
    </div>
  `).join("");
}

// ── PROMO HIGHLIGHT (Home sidebar) ───────────
export function renderPromoHighlight(promo) {
  const card = document.getElementById("promo-highlight-card");
  if (!card) return;
  if (!promo) { card.style.display = "none"; return; }
  card.style.display = "block";
  card.querySelector(".promo-card-title").textContent = promo.title;
  card.querySelector(".promo-card-text").textContent  = promo.description;
  card.onclick = () => showPage("promotions");
}

// ── SHOWS GRID ────────────────────────────────
export function renderShowsGrid(shows) {
  const grid = document.getElementById("shows-grid");
  if (!grid) return;
  if (!shows?.length) { grid.innerHTML = `<div style="padding:var(--sp);color:var(--muted)">No shows found.</div>`; return; }

  grid.innerHTML = shows.map(s => `
    <div class="show-card reveal" data-show-id="${s.id}" style="cursor:pointer">
      <div class="show-card-art" style="${s.thumbnailUrl ? `background-image:url('${s.thumbnailUrl}');background-size:cover;background-position:center` : ""}">
        ${!s.thumbnailUrl ? `<span style="font-size:3rem;z-index:1;position:relative">${s.emoji || "🎙"}</span>` : ""}
      </div>
      <div class="show-card-body">
        <div class="show-card-name">${s.name}</div>
        <div class="show-card-time">${s.timeSlot}</div>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".show-card").forEach(card => {
    card.addEventListener("click", () => showPage("show-detail", card.dataset.showId));
  });
}

// ── SHOW DETAIL ───────────────────────────────
export function renderShowDetail(show, hosts) {
  if (!show) return;

  // Hero
  const hero = document.getElementById("show-detail-hero");
  if (hero) {
    if (show.thumbnailUrl) {
      hero.style.backgroundImage  = `url('${show.thumbnailUrl}')`;
      hero.style.backgroundSize   = "cover";
      hero.style.backgroundPosition = "center";
      hero.querySelector(".show-hero-emoji").style.display = "none";
    } else {
      hero.querySelector(".show-hero-emoji").textContent = show.emoji || "🎙";
    }
    hero.querySelector(".show-hero-name").textContent = show.name;
    hero.querySelector(".show-hero-time").textContent = show.timeSlot;
  }

  setEl("show-detail-about", show.description);

  // Features
  const featList = document.getElementById("show-detail-features");
  if (featList && show.features?.length) {
    const markers = ["♪","✦","◌","▷","◈","✧"];
    featList.innerHTML = show.features.map((f, i) =>
      `<li><span class="feat-marker">${markers[i % markers.length]}</span> ${f}</li>`
    ).join("");
  }

  // Hosts
  const hostsContainer = document.getElementById("show-detail-hosts");
  if (hostsContainer) {
    hostsContainer.innerHTML = (hosts || []).map(h => `
      <div class="host-row reveal" data-host-id="${h.id}" style="cursor:pointer">
        <div class="host-photo" style="overflow:hidden">
          ${h.photoUrl
            ? `<img src="${h.photoUrl}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover">`
            : `<span style="font-size:1.4rem">${h.emoji || "🎙"}</span>`}
        </div>
        <div class="host-body">
          <div class="host-name">${h.name}</div>
          <div class="host-bio">${h.shortBio}</div>
          <span class="host-link">View profile →</span>
        </div>
      </div>
    `).join("");

    hostsContainer.querySelectorAll(".host-row").forEach(row => {
      row.addEventListener("click", () => showPage("host-profile", row.dataset.hostId));
    });
  }

  // Schedule
  renderScheduleSection("show-detail-schedule", show.scheduleRows || []);
}

// ── SCHEDULE SECTION (reusable) ───────────────
export function renderScheduleSection(containerId, rows, currentShowId = null) {
  const list = document.getElementById(containerId);
  if (!list) return;
  list.innerHTML = (rows || []).map(r => {
    const isNow = r.showId === currentShowId;
    return `
      <li class="schedule-row${isNow ? " current" : ""}">
        <span class="sched-time">${r.displayTime || r.time}</span>
        <span>${r.showName}</span>
        ${isNow ? `<span class="sched-live">Live</span>` : "<span></span>"}
      </li>`;
  }).join("");
}

// ── HOSTS GRID ────────────────────────────────
export function renderHostsGrid(hosts) {
  const grid = document.getElementById("hosts-grid");
  if (!grid) return;
  if (!hosts?.length) { grid.innerHTML = `<div style="padding:var(--sp);color:var(--muted)">No hosts found.</div>`; return; }

  grid.innerHTML = hosts.map(h => `
    <div class="host-card reveal" data-host-id="${h.id}" style="cursor:pointer">
      <div class="host-card-photo" style="overflow:hidden">
        ${h.photoUrl
          ? `<img src="${h.photoUrl}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover">`
          : `<span style="font-size:1.8rem">${h.emoji || "🎙"}</span>`}
      </div>
      <div class="host-card-name">${h.name}</div>
      <div class="host-card-role">${h.role}</div>
      <div class="host-card-arrow">View Profile →</div>
    </div>
  `).join("");

  grid.querySelectorAll(".host-card").forEach(card => {
    card.addEventListener("click", () => showPage("host-profile", card.dataset.hostId));
  });
}

// ── HOST PROFILE ──────────────────────────────
export function renderHostProfile(host, shows) {
  if (!host) return;

  const hero = document.getElementById("host-profile-hero");
  if (hero) {
    if (host.photoUrl) {
      hero.style.backgroundImage  = `url('${host.photoUrl}')`;
      hero.style.backgroundSize   = "cover";
      hero.style.backgroundPosition = "center top";
      const emoji = hero.querySelector(".host-profile-emoji");
      if (emoji) emoji.style.display = "none";
    } else {
      const emoji = hero.querySelector(".host-profile-emoji");
      if (emoji) emoji.textContent = host.emoji || "🎙";
    }
  }

  setEl("host-profile-name", host.name);
  setEl("host-profile-role", host.role);

  const bioEl = document.getElementById("host-profile-bio");
  if (bioEl) {
    bioEl.innerHTML = (host.bio || "").split("\n\n")
      .map(p => `<p>${p}</p>`).join("");
  }

  const showsContainer = document.getElementById("host-profile-shows");
  if (showsContainer) {
    showsContainer.innerHTML = (shows || []).map(s => `
      <div class="host-row reveal" data-show-id="${s.id}" style="cursor:pointer">
        <div class="host-photo" style="overflow:hidden">
          ${s.thumbnailUrl
            ? `<img src="${s.thumbnailUrl}" alt="${s.name}" style="width:100%;height:100%;object-fit:cover">`
            : `<span style="font-size:1.4rem">${s.emoji || "🎙"}</span>`}
        </div>
        <div class="host-body">
          <div class="host-name">${s.name}</div>
          <div class="host-bio">${s.timeSlot}</div>
          <span class="host-link">View show →</span>
        </div>
      </div>
    `).join("");

    showsContainer.querySelectorAll(".host-row").forEach(row => {
      row.addEventListener("click", () => showPage("show-detail", row.dataset.showId));
    });
  }
}

// ── HOST MODAL (Listen Live) ──────────────────
export function renderHostModal(host) {
  if (!host) return;
  const photo = document.getElementById("modal-host-photo");
  if (photo) {
    photo.innerHTML = host.photoUrl
      ? `<img src="${host.photoUrl}" alt="${host.name}" style="width:100%;height:100%;object-fit:cover">`
      : `<span style="font-size:1.4rem">${host.emoji || "🎙"}</span>`;
  }
  setEl("modal-host-name", host.name);
  setEl("modal-host-role", host.role);
  setEl("modal-host-bio",  host.shortBio || host.bio?.split("\n\n")[0]);

  const profileLink = document.getElementById("modal-profile-link");
  if (profileLink) profileLink.onclick = () => {
    showPage("host-profile", host.id);
    document.getElementById("hostOverlay")?.classList.remove("open");
    document.body.style.overflow = "";
  };
}

// ── LISTEN LIVE: host row ─────────────────────
export function renderListenLiveHost(host) {
  if (!host) return;
  const row = document.getElementById("listen-host-card");
  if (!row) return;

  const photo = row.querySelector(".host-photo");
  if (photo) {
    photo.innerHTML = host.photoUrl
      ? `<img src="${host.photoUrl}" alt="${host.name}" style="width:100%;height:100%;object-fit:cover">`
      : `<span style="font-size:1.4rem">${host.emoji || "🎙"}</span>`;
  }
  row.querySelector(".host-name").textContent = host.name;
  row.querySelector(".host-bio").textContent  = host.shortBio;

  row.onclick = () => {
    renderHostModal(host);
    document.getElementById("hostOverlay")?.classList.add("open");
    document.body.style.overflow = "hidden";
  };
}

// ── LISTEN LIVE: features ─────────────────────
export function renderListenFeatures(features) {
  const list = document.getElementById("listen-features-list");
  if (!list) return;
  const markers = ["♪","✦","◌","▷","◈"];
  list.innerHTML = (features || []).map((f, i) =>
    `<li><span class="feat-marker">${markers[i % markers.length]}</span> ${f}</li>`
  ).join("");
}

// ── BLOG PAGE ─────────────────────────────────
export function renderBlogPage(articles) {
  const list = document.getElementById("blog-page-list");
  if (!list) return;
  if (!articles?.length) { list.innerHTML = `<div style="padding:var(--sp);color:var(--muted)">No articles yet.</div>`; return; }

  list.innerHTML = articles.map(a => `
    <div class="blog-page-item reveal" data-article-id="${a.id}" style="cursor:pointer">
      <div class="blog-page-thumb">
        ${a.thumbnailUrl
          ? `<img src="${a.thumbnailUrl}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover">`
          : `<span style="font-size:2.2rem">${a.emoji || "📰"}</span>`}
      </div>
      <div class="blog-page-body">
        <div class="blog-page-meta">${fmtDate(a.publishedAt)} &nbsp;·&nbsp; ${a.category || ""}</div>
        <div class="blog-page-title">${a.title}</div>
        <div class="blog-page-excerpt">${a.excerpt}</div>
      </div>
    </div>
  `).join("");

  list.querySelectorAll(".blog-page-item").forEach(item => {
    item.addEventListener("click", () => showPage("article", item.dataset.articleId));
  });
}

// ── ARTICLE PAGE ──────────────────────────────
export function renderArticle(article) {
  if (!article) return;

  const hero = document.getElementById("article-hero");
  if (hero) {
    if (article.imageUrl) {
      hero.style.backgroundImage  = `url('${article.imageUrl}')`;
      hero.style.backgroundSize   = "cover";
      hero.style.backgroundPosition = "center";
      const emoji = hero.querySelector(".article-hero-emoji");
      if (emoji) emoji.style.display = "none";
    } else {
      const emoji = hero.querySelector(".article-hero-emoji");
      if (emoji) emoji.textContent = article.emoji || "📰";
    }
  }

  setEl("article-meta",  `${fmtDate(article.publishedAt)} · ${article.category || ""}`);
  setEl("article-title", article.title);

  const content = document.getElementById("article-content");
  if (content) {
    // Support newline-separated paragraphs or raw HTML
    if (article.contentHtml) {
      content.innerHTML = article.contentHtml;
    } else if (article.content) {
      content.innerHTML = article.content
        .split("\n\n")
        .map(p => `<p>${p}</p>`)
        .join("");
    }
  }
}

// ── PROMOTIONS PAGE ───────────────────────────
export function renderPromotionsPage(current, past, winners) {
  // Featured
  const featuredBody = document.getElementById("featured-promo-body");
  const featuredArt  = document.getElementById("featured-promo-art");
  if (featuredBody && current) {
    featuredBody.querySelector(".featured-promo-label").textContent = current.statusLabel || "Active";
    featuredBody.querySelector(".featured-promo-title").textContent = current.title;
    featuredBody.querySelector(".featured-promo-text").textContent  = current.description;

    const cta = featuredBody.querySelector(".featured-promo-cta");
    if (cta) cta.href = current.ctaUrl || "#";

    if (featuredArt && current.imageUrl) {
      featuredArt.style.backgroundImage  = `url('${current.imageUrl}')`;
      featuredArt.style.backgroundSize   = "cover";
      featuredArt.style.backgroundPosition = "center";
      featuredArt.querySelector(".featured-promo-emoji").style.display = "none";
    }
  }

  // Past
  const pastGrid = document.getElementById("past-promos-grid");
  if (pastGrid) {
    pastGrid.innerHTML = (past || []).map(p => `
      <div class="past-promo-card reveal">
        <div class="past-promo-status">Ended · ${fmtDate(p.endsAt)}</div>
        <div class="past-promo-title">${p.title}</div>
        <div class="past-promo-dates">${fmtDate(p.startsAt)} – ${fmtDate(p.endsAt)}</div>
      </div>
    `).join("");
  }

  // Winners
  const winnersList = document.getElementById("winners-list");
  if (winnersList) {
    winnersList.innerHTML = (winners || []).map((w, i) => `
      <li class="winner-row reveal" data-article-id="${w.articleId || ""}">
        <span class="winner-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="winner-name">${w.name} — ${w.location}</span>
        <span class="winner-prize">${w.prize}</span>
        ${w.articleId ? `<a class="winner-link" data-article-id="${w.articleId}">Read →</a>` : ""}
      </li>
    `).join("");

    winnersList.querySelectorAll("[data-article-id]").forEach(el => {
      el.addEventListener("click", () => {
        if (el.dataset.articleId) showPage("article", el.dataset.articleId);
      });
    });
  }
}

// ── ABOUT PAGE ────────────────────────────────
export function renderAboutPage(about) {
  if (!about) return;

  const logoEl = document.getElementById("about-station-logo");
  if (logoEl && about.callSign) {
    const [a, b] = [about.callSign.slice(0, 2), about.callSign.slice(2)];
    logoEl.innerHTML = `${a}<span class="about-logo-accent">${b}</span><br/>${about.frequency}`;
  }
  setEl("about-tagline",   about.tagline);
  setEl("stat-listeners",  about.statsListeners);
  setEl("stat-years",      about.statsYears);
  setEl("stat-shows",      about.statsShows);

  const sections = [
    ["about-who-text",     about.whoWeAre],
    ["about-mission-text", about.mission],
    ["about-bg-text",      about.background],
  ];
  sections.forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el && text) {
      el.innerHTML = text.split("\n\n").map(p => `<p>${p}</p>`).join("");
    }
  });
}

// ── CONTACT PAGE ──────────────────────────────
export function renderContactPage(contact) {
  if (!contact) return;
  setEl("contact-wa-number", contact.whatsapp);
  setEl("contact-wa-desc",   contact.whatsappDesc);

  const socials = [
    { id: "social-facebook",  data: contact.facebook },
    { id: "social-tiktok",    data: contact.tiktok },
    { id: "social-whatsapp",  data: contact.whatsappSocial },
  ];
  socials.forEach(({ id, data }) => {
    const card = document.getElementById(id);
    if (!card || !data) return;
    const handle = card.querySelector(".social-handle");
    if (handle) handle.textContent = data.handle;
    card.onclick = () => window.open(data.url, "_blank");
  });

  const addr = document.getElementById("contact-address");
  if (addr && contact.address) {
    addr.innerHTML = contact.address.split("\n").join("<br/>");
  }
}

// ── TRIGGER SCROLL REVEALS on dynamic content ──
export function triggerReveals(container = document) {
  const els = container.querySelectorAll(".reveal:not(.visible)");
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); ro.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  els.forEach(el => ro.observe(el));
}
