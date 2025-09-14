// Modular Firebase SDK bootstrapping
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

// -- USE YOUR CONFIG (safe to commit) --
export const firebaseConfig = {
  apiKey: "AIzaSyD5XBi3PzVPlZeFy541TVWwwiKqbIjkvpk",
  authDomain: "thewrkshop-pushnoti.firebaseapp.com",
  projectId: "thewrkshop-pushnoti",
  storageBucket: "thewrkshop-pushnoti.firebasestorage.app",
  messagingSenderId: "540768640641",
  appId: "1:540768640641:web:fd24a4c026a1ef801c3780",
  measurementId: "G-N48478JV2Z"
};

export const app       = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);
export const db        = getFirestore(app);
