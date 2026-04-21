// ═══════════════════════════════════════════════════════════════
//  WVBZ 98.7 — FIRESTORE SEED SCRIPT
//
//  USAGE:
//    1. npm install firebase
//    2. Fill in your Firebase config below
//    3. node seed.js
//
//  This script is safe to re-run (uses setDoc with merge: false).
//  Run ONCE to populate your Firestore database.
// ═══════════════════════════════════════════════════════════════

import { initializeApp }                           from "firebase/app";
import { getFirestore, setDoc, doc, Timestamp }    from "firebase/firestore";

// ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── HELPERS ──────────────────────────────────────────────────
const d  = (path, data) => setDoc(doc(db, path), data);
const ts = (iso)        => Timestamp.fromDate(new Date(iso));

// ── CLOUDINARY BASE URL (replace with your own or keep as-is) ─
// These are placeholder Unsplash images that work without any account.
const IMG = {
  morningVibes:   "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
  middayMix:      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
  afternoonDrive: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80",
  eveningShow:    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  fridayFever:    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  weekendWrapup:  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  djMarcus:       "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
  priyaNair:      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
  chrisTanaka:    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  sashaRoberts:   "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
  djTorch:        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&q=80",
  lenaMako:       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  blog1:          "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&q=80",
  blog2:          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&q=80",
  blog3:          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
  blog4:          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=80",
  blog5:          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80",
  promo1:         "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=80",
  promo2:         "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=80",
};

// ═══════════════════════════════════════════════════════════════
//  CONFIG DOCUMENTS
// ═══════════════════════════════════════════════════════════════

async function seedConfig() {
  console.log("Seeding config…");

  await d("config/station", {
    callSign:       "WVBZ",
    frequency:      "98.7",
    tagline:        "The Voice of the City",
    established:    "2005",
    facebook: {
      pageName:        "WVBZ 98.7",
      followersLabel:  "12,400 followers",
      pageUrl:         "https://facebook.com/wvbz987"
    }
  });

  await d("config/liveStream", {
    isLive:         true,
    streamUrl:      "https://your-icecast-stream.com/live",
    showName:       "Morning Vibes",
    showTagline:    "The best way to start your day",
    timeSlot:       "Mon – Fri  ·  6:00 AM – 10:00 AM",
    thumbnailUrl:   IMG.morningVibes,
    currentShowId:  "morning-vibes",
    updatedAt:      ts("2025-04-21T06:00:00Z")
  });

  await d("config/about", {
    callSign:       "WVBZ",
    frequency:      "98.7",
    tagline:        "The Voice of the City · Est. 2005",
    statsListeners: "400K+",
    statsYears:     "20+",
    statsShows:     "6",
    whoWeAre:
      "WVBZ 98.7 is an independent radio station built by and for this city. Since our first broadcast in 2005, we've been committed to honest, community-driven programming that reflects the real lives of the people we serve.\n\nWe're not a syndicated feed. Every show is live, local, and made with intention. Our presenters are part of this community — they shop at the same markets, attend the same events, and know the city the way only insiders can.",
    mission:
      "To give every listener a voice, a connection, and a soundtrack to their day. We believe radio at its best is a conversation — not a broadcast — and that belief shapes every decision we make.\n\nWe stay independent so we can stay honest. Our programming is guided by what the community needs, not what advertisers want to push. That's the promise we've kept for twenty years, and it's the one we'll keep for the next twenty.",
    background:
      "WVBZ launched on March 14, 2005 with a single transmitter and a team of five. Our first broadcast was a three-hour morning show that drew 800 listeners. Within a year, that number had grown to 40,000.\n\nToday we broadcast 18 hours a day, operate three studios, and employ a team of 24 full-time staff alongside a roster of freelance contributors. We have won seven regional broadcasting awards and have been recognized as one of the top independent stations in the country."
  });

  await d("config/contact", {
    whatsapp:      "+675 7123 4567",
    whatsappDesc:  "For song requests, dedications, competition entries, and general enquiries — WhatsApp is the fastest way to reach us during live shows.",
    facebook: {
      handle: "@WVBZ987",
      url:    "https://facebook.com/wvbz987"
    },
    tiktok: {
      handle: "@wvbz987",
      url:    "https://tiktok.com/@wvbz987"
    },
    whatsappSocial: {
      handle: "+675 7123 4567",
      url:    "https://wa.me/67571234567"
    },
    address: "WVBZ Broadcasting House\nLevel 3, Media Tower\nWaigani Drive, Port Moresby\nPapua New Guinea"
  });

  console.log("  ✓ config/station");
  console.log("  ✓ config/liveStream");
  console.log("  ✓ config/about");
  console.log("  ✓ config/contact");
}

// ═══════════════════════════════════════════════════════════════
//  PROMO STRIP
// ═══════════════════════════════════════════════════════════════

async function seedPromoStrip() {
  console.log("Seeding promoStrip…");

  await d("promoStrip/summer-concert", {
    active:   true,
    order:    1,
    title:    "Win Tickets This Friday!",
    subtitle: "Score two VIP passes to the biggest show of the summer.",
    linkPage: "promotions"
  });

  console.log("  ✓ promoStrip/summer-concert");
}

// ═══════════════════════════════════════════════════════════════
//  SHOWS
// ═══════════════════════════════════════════════════════════════

async function seedShows() {
  console.log("Seeding shows…");

  const shows = [
    {
      id: "morning-vibes",
      name:         "Morning Vibes",
      timeSlot:     "Mon – Fri · 6:00 – 10:00 AM",
      displayTime:  "6–10 AM",
      order:        1,
      featured:     true,
      emoji:        "🎙",
      thumbnailUrl: IMG.morningVibes,
      description:  "Morning Vibes is the city's most-listened-to morning radio show. Starting your day with the best music, breaking news, and community conversation — hosted by DJ Marcus Bell since 2010. Every morning is a fresh set of energy, connection, and sound that sets the tone for the whole day.",
      features: [
        "Top 40, R&B, and hip-hop — no filler",
        "Weekly celebrity interviews & exclusives",
        "Live call-ins every Friday morning",
        "News headlines at 7AM and 8AM daily"
      ],
      hostIds: ["dj-marcus-bell"],
      hostNames: ["DJ Marcus Bell"],
      scheduleRows: [
        { time: "Mon – Fri", showName: "Morning Vibes", displayTime: "6:00 – 10:00 AM", showId: "morning-vibes" }
      ]
    },
    {
      id: "midday-mix",
      name:         "Midday Mix",
      timeSlot:     "Mon – Fri · 10:00 AM – 2:00 PM",
      displayTime:  "10AM–2PM",
      order:        2,
      featured:     false,
      emoji:        "🎵",
      thumbnailUrl: IMG.middayMix,
      description:  "Keep the energy going through the lunch hour with the Midday Mix. Priya Nair brings you the smoothest blend of current hits and all-time favourites to power through your day.",
      features: [
        "Nonstop hits through the lunch hour",
        "Throwback Thursday editions",
        "Shoutout segments every Friday",
        "Community notice board daily at 1PM"
      ],
      hostIds: ["priya-nair"],
      hostNames: ["Priya Nair"],
      scheduleRows: [
        { time: "Mon – Fri", showName: "Midday Mix", displayTime: "10:00 AM – 2:00 PM", showId: "midday-mix" }
      ]
    },
    {
      id: "afternoon-drive",
      name:         "Afternoon Drive",
      timeSlot:     "Mon – Fri · 2:00 – 6:00 PM",
      displayTime:  "2–6 PM",
      order:        3,
      featured:     false,
      emoji:        "🚗",
      thumbnailUrl: IMG.afternoonDrive,
      description:  "Your commute just got better. Chris Tanaka hosts the city's favourite drive-time show — big tracks, listener requests, and everything you need to unwind after work.",
      features: [
        "Top drive-time hits and deep cuts",
        "Listener request hour at 4PM",
        "Traffic and news updates every 30 min",
        "Friday Feel-Good countdown"
      ],
      hostIds: ["chris-tanaka"],
      hostNames: ["Chris Tanaka"],
      scheduleRows: [
        { time: "Mon – Fri", showName: "Afternoon Drive", displayTime: "2:00 – 6:00 PM", showId: "afternoon-drive" }
      ]
    },
    {
      id: "evening-show",
      name:         "The Evening Show",
      timeSlot:     "Mon – Fri · 6:00 – 10:00 PM",
      displayTime:  "6–10 PM",
      order:        4,
      featured:     false,
      emoji:        "🌃",
      thumbnailUrl: IMG.eveningShow,
      description:  "Wind down with Sasha Roberts and The Evening Show. Deep cuts, chill vibes, and conversations that go beyond the music — the perfect companion for your evenings.",
      features: [
        "Deep cuts and album tracks",
        "Artist spotlight every Wednesday",
        "Listener dedications at 8PM",
        "Late night chill from 9PM"
      ],
      hostIds: ["sasha-roberts"],
      hostNames: ["Sasha Roberts"],
      scheduleRows: [
        { time: "Mon – Fri", showName: "The Evening Show", displayTime: "6:00 – 10:00 PM", showId: "evening-show" }
      ]
    },
    {
      id: "friday-fever",
      name:         "Friday Night Fever",
      timeSlot:     "Friday · 9:00 PM – 1:00 AM",
      displayTime:  "9PM–1AM",
      order:        5,
      featured:     false,
      emoji:        "🔥",
      thumbnailUrl: IMG.fridayFever,
      description:  "WVBZ goes full party mode every Friday night. DJ Torch takes over with the biggest club anthems, Afrobeats, dancehall, and everything in between to kick off your weekend.",
      features: [
        "Club anthems, Afrobeats & dancehall",
        "Live DJ sets and guest mixes",
        "WhatsApp requests welcome all night",
        "Midnight Madness mix every week"
      ],
      hostIds: ["dj-torch"],
      hostNames: ["DJ Torch"],
      scheduleRows: [
        { time: "Friday", showName: "Friday Night Fever", displayTime: "9:00 PM – 1:00 AM", showId: "friday-fever" }
      ]
    },
    {
      id: "weekend-wrapup",
      name:         "Weekend Wrap-Up",
      timeSlot:     "Sunday · 10:00 AM – 2:00 PM",
      displayTime:  "Sun 10AM–2PM",
      order:        6,
      featured:     false,
      emoji:        "☀️",
      thumbnailUrl: IMG.weekendWrapup,
      description:  "Close out your weekend the right way with Lena Mako. Weekend Wrap-Up brings you the week's biggest music moments, feel-good stories from the community, and the perfect Sunday soundtrack.",
      features: [
        "Week's top tracks countdown",
        "Community stories and highlights",
        "Feel-good music from the 80s to now",
        "Preview of the week ahead"
      ],
      hostIds: ["lena-mako"],
      hostNames: ["Lena Mako"],
      scheduleRows: [
        { time: "Sunday", showName: "Weekend Wrap-Up", displayTime: "10:00 AM – 2:00 PM", showId: "weekend-wrapup" }
      ]
    }
  ];

  for (const show of shows) {
    const { id, ...data } = show;
    await d(`shows/${id}`, data);
    console.log(`  ✓ shows/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  HOSTS
// ═══════════════════════════════════════════════════════════════

async function seedHosts() {
  console.log("Seeding hosts…");

  const hosts = [
    {
      id: "dj-marcus-bell",
      name:      "DJ Marcus Bell",
      role:      "Morning Host · Morning Vibes",
      order:     1,
      emoji:     "🎙",
      photoUrl:  IMG.djMarcus,
      shortBio:  "Spinning the hits and keeping the city moving since 2009. Fifteen years behind the mic.",
      bio:       "Marcus Bell has been the voice of morning radio in the city for over fifteen years. Known for his energy, deep music knowledge, and genuine connection with listeners, he's turned Morning Vibes into a local institution.\n\nWhen he's not on air, Marcus runs community events and mentors aspiring broadcasters across the region. He holds a broadcasting degree from the National Radio College and has won three local media awards for audience engagement.",
      showIds:   ["morning-vibes"],
      socials: { instagram: "#", twitter: "#" }
    },
    {
      id: "priya-nair",
      name:      "Priya Nair",
      role:      "Midday Host · Midday Mix",
      order:     2,
      emoji:     "🎤",
      photoUrl:  IMG.priyaNair,
      shortBio:  "Bringing warmth and energy to the city's lunch hour since 2015.",
      bio:       "Priya Nair joined WVBZ in 2015 after cutting her teeth in community radio. Her effortless style and encyclopedic knowledge of both pop and world music made her the natural choice for the Midday Mix.\n\nOffscreen, Priya is a passionate advocate for local arts programs and regularly hosts fundraising events for youth cultural initiatives across the city.",
      showIds:   ["midday-mix"],
      socials: { instagram: "#", twitter: "#" }
    },
    {
      id: "chris-tanaka",
      name:      "Chris Tanaka",
      role:      "Afternoon Host · Afternoon Drive",
      order:     3,
      emoji:     "🎵",
      photoUrl:  IMG.chrisTanaka,
      shortBio:  "Your drive-time companion. Making the commute the best part of your day.",
      bio:       "Chris Tanaka is the city's most beloved drive-time voice. His natural humor and ability to read the room — whether it's a joyful Friday or a sleepy Monday — keeps listeners tuned in from 2 to 6 every weekday.\n\nChris is a lifelong music obsessive who started DJing at university events before transitioning to broadcast. He holds a record for the most listener requests fulfilled in a single afternoon shift.",
      showIds:   ["afternoon-drive"],
      socials: { instagram: "#", twitter: "#" }
    },
    {
      id: "sasha-roberts",
      name:      "Sasha Roberts",
      role:      "Evening Host · The Evening Show",
      order:     4,
      emoji:     "🌃",
      photoUrl:  IMG.sashaRoberts,
      shortBio:  "Deep cuts, real conversations, and the soundtrack to your evenings.",
      bio:       "Sasha Roberts brings a quiet authority to the evening airwaves that has earned her a fiercely loyal following. Her show is less about the noise and more about the story behind the music.\n\nWith a background in journalism and a passion for artist discovery, Sasha regularly breaks new local talent on the station. Her Wednesday Artist Spotlight segment has launched several careers.",
      showIds:   ["evening-show"],
      socials: { instagram: "#", twitter: "#" }
    },
    {
      id: "dj-torch",
      name:      "DJ Torch",
      role:      "Weekend Host · Friday Night Fever",
      order:     5,
      emoji:     "🔥",
      photoUrl:  IMG.djTorch,
      shortBio:  "Setting the city on fire every Friday night. The party starts at 9.",
      bio:       "DJ Torch has been one of the most in-demand DJs in the city for a decade. His Friday Night Fever show on WVBZ is the city's unofficial start-of-weekend signal — when Torch goes live, the party begins.\n\nA master of transitions and crowd energy, Torch brings the same intensity to radio that he does to club nights, festival sets, and the sold-out live events he headlines every quarter.",
      showIds:   ["friday-fever"],
      socials: { instagram: "#", twitter: "#" }
    },
    {
      id: "lena-mako",
      name:      "Lena Mako",
      role:      "Weekend Host · Weekend Wrap-Up",
      order:     6,
      emoji:     "☀️",
      photoUrl:  IMG.lenaMako,
      shortBio:  "Your Sunday morning voice. Stories, music, and the best way to close your weekend.",
      bio:       "Lena Mako brings a warm, unhurried energy to Sunday mornings that perfectly matches the mood of the Weekend Wrap-Up. A trained journalist with a love of storytelling, she weaves community news and music into something that feels more like a conversation with a friend than a broadcast.\n\nLena joined WVBZ in 2018 and quickly became one of the station's most distinctive voices. She also contributes long-form articles to the WVBZ blog.",
      showIds:   ["weekend-wrapup"],
      socials: { instagram: "#", twitter: "#" }
    }
  ];

  for (const host of hosts) {
    const { id, ...data } = host;
    await d(`hosts/${id}`, data);
    console.log(`  ✓ hosts/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  SCHEDULE
// ═══════════════════════════════════════════════════════════════

async function seedSchedule() {
  console.log("Seeding schedule…");

  const items = [
    {
      id: "sched-morning-vibes",
      showId:      "morning-vibes",
      showName:    "Morning Vibes",
      displayTime: "6:00 – 10:00 AM",
      startHour:   6,
      days:        ["monday","tuesday","wednesday","thursday","friday"]
    },
    {
      id: "sched-midday-mix",
      showId:      "midday-mix",
      showName:    "Midday Mix",
      displayTime: "10:00 AM – 2:00 PM",
      startHour:   10,
      days:        ["monday","tuesday","wednesday","thursday","friday"]
    },
    {
      id: "sched-afternoon-drive",
      showId:      "afternoon-drive",
      showName:    "Afternoon Drive",
      displayTime: "2:00 – 6:00 PM",
      startHour:   14,
      days:        ["monday","tuesday","wednesday","thursday","friday"]
    },
    {
      id: "sched-evening-show",
      showId:      "evening-show",
      showName:    "The Evening Show",
      displayTime: "6:00 – 10:00 PM",
      startHour:   18,
      days:        ["monday","tuesday","wednesday","thursday","friday"]
    },
    {
      id: "sched-friday-fever",
      showId:      "friday-fever",
      showName:    "Friday Night Fever",
      displayTime: "9:00 PM – 1:00 AM",
      startHour:   21,
      days:        ["friday"]
    },
    {
      id: "sched-weekend-wrapup",
      showId:      "weekend-wrapup",
      showName:    "Weekend Wrap-Up",
      displayTime: "10:00 AM – 2:00 PM",
      startHour:   10,
      days:        ["sunday"]
    }
  ];

  for (const item of items) {
    const { id, ...data } = item;
    await d(`schedule/${id}`, data);
    console.log(`  ✓ schedule/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  BLOG ARTICLES
// ═══════════════════════════════════════════════════════════════

async function seedArticles() {
  console.log("Seeding articles…");

  const articles = [
    {
      id: "behind-the-mic",
      title:       "Behind the Mic: How We Built Morning Vibes from Scratch",
      excerpt:     "A candid look at the early days of our flagship morning show, the struggles, the breakthroughs, and what it means to be the city's alarm clock.",
      category:    "Behind the Mic",
      emoji:       "📰",
      thumbnailUrl: IMG.blog1,
      imageUrl:    IMG.blog1,
      published:   true,
      publishedAt: ts("2025-04-18T07:00:00Z"),
      contentHtml: `<p>In 2010, Morning Vibes was just an idea scrawled on a napkin in the station break room. Today it reaches nearly 200,000 listeners before 8 AM. This is how it happened — and what we learned along the way.</p>
<p>When Marcus Bell first came to us, he didn't have a polished demo tape or a television background. What he had was an instinct for conversation and an encyclopedic memory for music that stretched from the 1970s to last week's chart releases. That combination turned out to be exactly what this city needed at 6 in the morning.</p>
<p>We spent the first three months iterating on the format. The call-in segment launched in week two. By month three, our switchboard was lighting up at 6:10 AM every day. Listeners weren't just tuning in — they were making the show part of their routine, their commute, their morning ritual.</p>
<p>The breakthrough came not from a marketing push but from one memorable Friday in March when Marcus hosted a live dedication segment for a couple celebrating their 40th anniversary. The station's phone lines didn't stop for two hours. We knew then that we had built something real.</p>
<p>Over fifteen years, Morning Vibes has had three format refreshes, two co-hosts, and one legendary run-in with a live studio parrot gifted by a listener. Through all of it, the show has stayed true to its original promise: honest, energetic, community-first radio.</p>`
    },
    {
      id: "top-10-songs",
      title:       "Top 10 Songs Your City Can't Stop Playing Right Now",
      excerpt:     "The playlist dominating airwaves and your social feeds this April. We count down the tracks you keep requesting.",
      category:    "Music",
      emoji:       "🎶",
      thumbnailUrl: IMG.blog2,
      imageUrl:    IMG.blog2,
      published:   true,
      publishedAt: ts("2025-04-12T08:00:00Z"),
      contentHtml: `<p>Every week, thousands of you send in your requests and dedications via WhatsApp. We've crunched the data from April to bring you the definitive list of what the city can't stop listening to right now.</p>
<p>The top spot belongs to a track that's been on rotation since mid-March — you know the one. Below it, a surprising resurgence from a 2019 album that went viral on TikTok this month, proving once again that great music has no expiry date.</p>
<p>What makes this month's chart interesting is the diversity of genres sitting side by side. Afrobeats, classic R&B, a country crossover, and one purely local track that climbed from zero to number four in under a week on the back of pure community love.</p>
<p>Tune in to Morning Vibes daily at 9AM for the full countdown, or catch our weekly chart special every Sunday on Weekend Wrap-Up with Lena Mako.</p>`
    },
    {
      id: "summer-concert-winners",
      title:       "Winners Announced: Summer Concert Giveaway",
      excerpt:     "Five lucky listeners are heading to the show of the year. Find out who won and how they entered.",
      category:    "Promotions",
      emoji:       "🏆",
      thumbnailUrl: IMG.blog3,
      imageUrl:    IMG.blog3,
      published:   true,
      publishedAt: ts("2025-04-05T09:00:00Z"),
      contentHtml: `<p>The entries poured in over two weeks. More than 4,200 of you sent in your names for the chance to win a pair of VIP tickets to this summer's biggest outdoor concert event.</p>
<p>Our team drew the five winners live on Morning Vibes last Friday — each one picked at random from the verified entry list. The reactions ranged from stunned silence to tears of joy to one memorable victory scream that we're fairly sure the whole studio building heard.</p>
<p>Congratulations to Sarah T., John M., Grace and Paul K., Daniel R., and Maria S. — your tickets and VIP wristbands are on their way. Check your WhatsApp for details.</p>
<p>Keep an eye out for our next giveaway, launching this Friday on Morning Vibes. As always, the easiest way to enter is via our WhatsApp number. Follow us on Facebook to be the first to know.</p>`
    },
    {
      id: "wvbz-turns-20",
      title:       "WVBZ Turns 20: Two Decades of Broadcasting Excellence",
      excerpt:     "From our first transmission to reaching 400,000 listeners — a look back at twenty years on the air.",
      category:    "Station News",
      emoji:       "📻",
      thumbnailUrl: IMG.blog4,
      imageUrl:    IMG.blog4,
      published:   true,
      publishedAt: ts("2025-03-28T07:00:00Z"),
      contentHtml: `<p>On March 14, 2005, a small team of five people sat in a room barely big enough for their equipment and went live for the first time. Nobody was sure anyone was listening. As it turned out, 800 people were.</p>
<p>Twenty years later, WVBZ 98.7 reaches over 400,000 listeners a week. We have six daily shows, three studios, a full newsroom, and a team that cares as much about this city as the people who live in it. We've interviewed presidents and chart-topping artists, given voice to community issues that would otherwise go unheard, and celebrated the city's moments of joy with you.</p>
<p>We've also made mistakes, retooled, and grown. The WVBZ of 2025 is not the WVBZ of 2005 — it's better, bolder, and more connected to you than ever. That's only possible because of the listeners who showed up, called in, sent dedications, and made this station part of their daily lives.</p>
<p>Here's to twenty more. Thank you for listening.</p>`
    },
    {
      id: "exclusive-interview",
      title:       "Exclusive: 30 Minutes with This Month's Chart-Topper",
      excerpt:     "We sat down with the artist everyone is talking about. Here's what they said about the city, the craft, and what's next.",
      category:    "Interview",
      emoji:       "🌟",
      thumbnailUrl: IMG.blog5,
      imageUrl:    IMG.blog5,
      published:   true,
      publishedAt: ts("2025-03-15T08:00:00Z"),
      contentHtml: `<p>There's a moment in a great interview when the artist stops thinking about the PR talking points and just starts talking. That moment came about eight minutes in, when we asked about the song that wasn't supposed to make the album.</p>
<p>What followed was a thirty-minute conversation about doubt, revision, the relationship between an artist and their audience, and why this city in particular holds such a special place in their touring calendar. They've played the big venues. They still remember the small ones.</p>
<p>We talked about the chart success — yes, the number is real, and yes, it surprised them too — but also about what comes after the moment. The pressure to repeat. The temptation to make the same record again. The choice to do something harder instead.</p>
<p>The full interview aired on The Evening Show this week and is available to replay on our Facebook page. Don't miss it — it's one of the best conversations we've had in the studio in years.</p>`
    }
  ];

  for (const article of articles) {
    const { id, ...data } = article;
    await d(`articles/${id}`, data);
    console.log(`  ✓ articles/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  PROMOTIONS
// ═══════════════════════════════════════════════════════════════

async function seedPromotions() {
  console.log("Seeding promotions…");

  await d("promotions/summer-concert-2025", {
    status:       "active",
    statusLabel:  "Active · Ends Friday",
    title:        "Summer Concert VIP Giveaway",
    description:  "Win two VIP tickets to the biggest outdoor concert of the summer. Text your name and suburb to our WhatsApp number. Five pairs to give away. Entries close this Friday at midnight.",
    ctaUrl:       "https://wa.me/67571234567",
    imageUrl:     IMG.promo1,
    emoji:        "🎫",
    startsAt:     ts("2025-04-18T00:00:00Z"),
    endsAt:       ts("2025-04-25T23:59:59Z")
  });

  await d("promotions/easter-hamper-2025", {
    status:   "ended",
    title:    "Easter Hamper Giveaway",
    emoji:    "🐣",
    imageUrl: IMG.promo2,
    startsAt: ts("2025-03-20T00:00:00Z"),
    endsAt:   ts("2025-03-31T23:59:59Z")
  });

  await d("promotions/restaurant-vouchers-2025", {
    status:   "ended",
    title:    "Restaurant Voucher Pack",
    emoji:    "🍽️",
    imageUrl: IMG.promo2,
    startsAt: ts("2025-03-01T00:00:00Z"),
    endsAt:   ts("2025-03-10T23:59:59Z")
  });

  await d("promotions/valentines-dinner-2025", {
    status:   "ended",
    title:    "Valentine's Dinner for Two",
    emoji:    "💝",
    imageUrl: IMG.promo2,
    startsAt: ts("2025-02-07T00:00:00Z"),
    endsAt:   ts("2025-02-14T23:59:59Z")
  });

  await d("promotions/sports-day-2025", {
    status:   "ended",
    title:    "Sports Day Hospitality Package",
    emoji:    "🏟️",
    imageUrl: IMG.promo2,
    startsAt: ts("2025-01-15T00:00:00Z"),
    endsAt:   ts("2025-01-26T23:59:59Z")
  });

  console.log("  ✓ 5 promotions seeded");
}

// ═══════════════════════════════════════════════════════════════
//  WINNERS
// ═══════════════════════════════════════════════════════════════

async function seedWinners() {
  console.log("Seeding winners…");

  const winners = [
    { id: "w1", name: "Sarah T.",       location: "Port Moresby", prize: "Easter Hamper",           articleId: "summer-concert-winners", announcedAt: ts("2025-04-05T09:00:00Z") },
    { id: "w2", name: "John M.",        location: "Lae",          prize: "Restaurant Voucher Pack", articleId: "summer-concert-winners", announcedAt: ts("2025-03-11T09:00:00Z") },
    { id: "w3", name: "Grace & Paul K.",location: "",             prize: "Valentine's Dinner",      articleId: "summer-concert-winners", announcedAt: ts("2025-02-15T09:00:00Z") },
    { id: "w4", name: "Daniel R.",      location: "Madang",       prize: "Sports Day Package",      articleId: "summer-concert-winners", announcedAt: ts("2025-01-27T09:00:00Z") },
    { id: "w5", name: "Maria S.",       location: "Mt. Hagen",    prize: "Restaurant Voucher Pack", articleId: "summer-concert-winners", announcedAt: ts("2025-03-11T10:00:00Z") }
  ];

  for (const winner of winners) {
    const { id, ...data } = winner;
    await d(`winners/${id}`, data);
    console.log(`  ✓ winners/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  FACEBOOK FEED
// ═══════════════════════════════════════════════════════════════

async function seedFacebookFeed() {
  console.log("Seeding facebookFeed…");

  const posts = [
    {
      id:       "fb1",
      text:     "🎙 Morning Vibes is LIVE right now — tune in and send your dedications via WhatsApp! #WVBZ #LiveRadio",
      postedAt: ts("2025-04-21T06:15:00Z")
    },
    {
      id:       "fb2",
      text:     "Congratulations to last week's giveaway winners! Stay tuned — another promo drops Friday. 🏆",
      postedAt: ts("2025-04-20T14:00:00Z")
    },
    {
      id:       "fb3",
      text:     "20 years on air. Thank you for every call-in, every request, every listen. This city is everything. ❤️",
      postedAt: ts("2025-03-14T09:00:00Z")
    }
  ];

  for (const post of posts) {
    const { id, ...data } = post;
    await d(`facebookFeed/${id}`, data);
    console.log(`  ✓ facebookFeed/${id}`);
  }
}

// ═══════════════════════════════════════════════════════════════
//  FIRESTORE SECURITY RULES (printed to console, not applied)
// ═══════════════════════════════════════════════════════════════

function printSecurityRules() {
  console.log("\n──────────────────────────────────────────────");
  console.log("RECOMMENDED FIRESTORE SECURITY RULES");
  console.log("Copy these into Firebase Console → Firestore → Rules");
  console.log("──────────────────────────────────────────────");
  console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public read for all content collections
    match /config/{doc} {
      allow read: if true;
      allow write: if false; // Admin only via Firebase Console or Admin SDK
    }
    match /shows/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /hosts/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /schedule/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /articles/{doc} {
      allow read: if resource.data.published == true;
      allow write: if false;
    }
    match /promotions/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /winners/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /facebookFeed/{doc} {
      allow read: if true;
      allow write: if false;
    }
    match /promoStrip/{doc} {
      allow read: if true;
      allow write: if false;
    }
  }
}
  `);
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  WVBZ 98.7 — Firestore Seed Script");
  console.log("═══════════════════════════════════════════\n");

  try {
    await seedConfig();
    await seedPromoStrip();
    await seedShows();
    await seedHosts();
    await seedSchedule();
    await seedArticles();
    await seedPromotions();
    await seedWinners();
    await seedFacebookFeed();

    console.log("\n✅ All collections seeded successfully!\n");
    printSecurityRules();

  } catch (err) {
    console.error("\n❌ Seed failed:", err);
    process.exit(1);
  }

  process.exit(0);
}

main();
