// ─────────────────────────────────────────────
//  FIREBASE CONFIGURATION
//  Replace these values with your Firebase project credentials.
//  Found in: Firebase Console → Project Settings → Your Apps → SDK Setup
// ─────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC05Dzi0FatRWEVfc-bR7QzVHezGay6fI8",
  authDomain: "radio-website-e18df.firebaseapp.com",
  projectId: "radio-website-e18df",
  storageBucket: "radio-website-e18df.firebasestorage.app",
  messagingSenderId: "538244078719",
  appId: "1:538244078719:web:f9a064f631378f497d734a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
