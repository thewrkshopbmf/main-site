// scripts/firebase/push.js
import { messaging, db } from "./firebase.js";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

// Prefer Vite env, fallback to constant/global if you want.
const VAPID_PUBLIC_KEY =
  (import.meta?.env?.VITE_FCM_VAPID_PUBLIC_KEY || "").trim() ||
  (typeof window !== "undefined" ? (window.VAPID_PUBLIC_KEY || "").trim() : "") ||
  "BI41TzjC8SkMz7WRCEIwrMMYOcOtDWWtcIfO9tYyaXt_pLEY2IPqWzZfFQ0xwWRazw9zp39pLP7BcmZhn9eNwfc";

const SW_PATH = "/firebase-messaging-sw.js"; // ensure this exists at site root

async function ensureServiceWorkerReady() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported in this browser");
  }
  let reg = await navigator.serviceWorker.getRegistration("/");
  if (!reg) reg = await navigator.serviceWorker.register(SW_PATH);
  await navigator.serviceWorker.ready;
  return reg;
}

export async function subscribeToDevotional() {
  // Ask user first (helps avoid getToken failing silently)
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error(`Notification permission was ${perm}`);

  if (!VAPID_PUBLIC_KEY) {
    throw new Error("Missing VAPID public key (VITE_FCM_VAPID_PUBLIC_KEY).");
  }

  const reg = await ensureServiceWorkerReady();

  // Retrieve (or create) FCM registration token
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: reg,
  });
  if (!token) throw new Error("Failed to obtain FCM token");

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";

  await setDoc(
    doc(db, "push_subscribers", token),
    { enabled: true, timezone: tz, createdAt: new Date().toISOString() },
    { merge: true }
  );

  return token;
}

export async function unsubscribeFromDevotional() {
  const reg = await ensureServiceWorkerReady();

  let token = null;
  try {
    token = await getToken(messaging, {
      vapidKey: VAPID_PUBLIC_KEY,
      serviceWorkerRegistration: reg,
    });
  } catch {
    // if getToken fails, we’ll still attempt deleteToken below
  }

  if (token) {
    await setDoc(
      doc(db, "push_subscribers", token),
      { enabled: false, disabledAt: new Date().toISOString() },
      { merge: true }
    );
  }

  // Best-effort delete; returns boolean
  await deleteToken(messaging);
  return true;
}

export function onForegroundMessage(cb) {
  return onMessage(messaging, (payload) => cb?.(payload));
}
