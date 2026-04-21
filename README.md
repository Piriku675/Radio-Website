# WVBZ 98.7 — Dynamic Radio Station Website

A fully dynamic radio station website powered by **Firebase Firestore**.  
Design is identical to the original mockup. All content is served from Firestore.

---

## Project Structure

```
wvbz/
├── index.html              # Main SPA shell (no hardcoded content)
├── seed.js                 # Firestore seed script (run once)
├── package.json
├── css/
│   └── styles.css          # Full design system (unchanged from mockup)
└── js/
    ├── app.js              # Entry point — boots theme, nav, initial page
    ├── firebase-config.js  # Firebase credentials (fill in yours)
    ├── data-service.js     # All Firestore reads (centralised)
    ├── renderers.js        # Pure render functions — data in, DOM out
    ├── router.js           # Page routing + per-page data loading
    ├── player.js           # Audio player + mini-player logic
    └── pages/
        ├── home.js
        ├── listen.js
        ├── shows.js
        ├── show-detail.js
        ├── hosts.js
        ├── host-profile.js
        ├── blog.js
        ├── article.js
        ├── promotions.js
        ├── about.js
        └── contact.js
```

---

## Firestore Collections

| Collection      | Description                                      |
|----------------|--------------------------------------------------|
| `config/station`    | Call sign, frequency, tagline, Facebook config |
| `config/liveStream` | Active stream URL, show name, is-live status   |
| `config/about`      | About page copy + stats                        |
| `config/contact`    | WhatsApp number, social links, address         |
| `promoStrip`        | Top banner promotion (active=true shown)       |
| `shows`             | All shows with features, host IDs, schedule    |
| `hosts`             | Host profiles with bios, photo URLs, show IDs  |
| `schedule`          | Daily schedule entries with day-of-week filter |
| `articles`          | Blog articles (published=true shown publicly)  |
| `promotions`        | Active + past promotions                       |
| `winners`           | Giveaway winners with article links            |
| `facebookFeed`      | Facebook post previews for home page           |

---

## Setup Instructions

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Add a **Web app** to the project
4. Copy the SDK config object shown after registration

### 2. Enable Firestore

1. In the Firebase console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (you'll add proper rules after seeding)
4. Select a region close to your users

### 3. Fill in your Firebase config

Open **both** of these files and replace the placeholder values:

- `js/firebase-config.js` — used by the live website
- `seed.js` — used by the seed script

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

### 4. Run the seed script

```bash
npm install
npm run seed
```

This populates all Firestore collections with realistic sample data.  
It is safe to re-run (each document is written by fixed ID).

### 5. Update your stream URL

In **Firestore Console**, open `config/liveStream` and set `streamUrl` to your actual Icecast/Shoutcast stream URL.

### 6. Add Firestore Security Rules

After seeding, lock down write access. In Firebase Console → Firestore → Rules, paste the rules printed by the seed script, or use:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 7. Serve the site

Because the JS uses ES modules, the site must be served over HTTP (not opened as a local file).

**Option A — VS Code Live Server**  
Install the Live Server extension and click "Go Live".

**Option B — Python**
```bash
python3 -m http.server 8080
```

**Option C — Deploy to Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## Updating Content

All content is managed directly in **Firestore Console** — no code changes needed.

| To change…              | Edit document…                        |
|------------------------|---------------------------------------|
| Live stream show name  | `config/liveStream`                   |
| Active promo banner    | `promoStrip/` — set `active: true`    |
| Add a new show         | Add document to `shows/`              |
| Add a new host         | Add document to `hosts/`              |
| Publish a blog post    | Add document to `articles/` with `published: true` |
| Add a promotion        | Add document to `promotions/` with `status: "active"` |
| Announce a winner      | Add document to `winners/`            |
| Update station stats   | `config/about`                        |
| Update contact details | `config/contact`                      |

---

## Image Recommendations

For production, replace Unsplash placeholder URLs with your own images.  
**Cloudinary** is recommended for automatic resizing and optimisation:

```
https://res.cloudinary.com/YOUR_CLOUD/image/upload/w_800,q_auto/your-image.jpg
```

Store all `thumbnailUrl`, `photoUrl`, and `imageUrl` fields in the Firestore documents.

---

## Live Stream

The site uses the browser's native `<audio>` element.  
Set `streamUrl` in `config/liveStream` to your Icecast/Shoutcast endpoint:

```
https://your-server.com:8000/stream
```

The `isLive` field controls the ON AIR badge visibility.  
Update it in real time via the Firestore console or your broadcast software's webhook.
