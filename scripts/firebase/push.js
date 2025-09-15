// scripts/firebase/push.js
import { messaging, db } from "./firebase.js";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

// VAPID **public** key (safe to expose in client code)
const VAPID_PUBLIC_KEY = "BI41TzjC8SkMz7WRCEIwrMMYOcOtDWWtcIfO9tYyaXt_pLEY2IPqWzZfFQ0xwWRazw9zp39pLP7BcmZhn9eNwfc";

/**
 * Ensure the Firebase Messaging service worker is registered at the site root
 * and is fully active before attempting push subscription/token retrieval.
 */
export async function ensureServiceWorkerReady() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers not supported");
  }

  // Reuse existing registration if present; otherwise register
  let reg = await navigator.serviceWorker.getRegistration("/");
  if (!reg) {
    reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  }

  // Wait until the active SW is ready to control the page
  await navigator.serviceWorker.ready;
  return reg;
}

/**
 * Request permission and subscribe to daily devotional push notifications.
 * Saves the token into Firestore (doc id = token) with basic metadata.
 */
export async function subscribeToDevotional() {
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Notifications blocked by the browser");

  const reg = await ensureServiceWorkerReady();

  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: reg
  });
  if (!token) throw new Error("Failed to get FCM token");

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";

  await setDoc(
    doc(db, "push_subscribers", token),
    {
      enabled: true,
      timezone: tz,
      createdAt: new Date().toISOString()
    },
    { merge: true }
  );

  return token;
}

/**
 * Unsubscribe from notifications: mark disabled in Firestore and delete the client token.
 */
export async function unsubscribeFromDevotional() {
  const reg = await ensureServiceWorkerReady();

  // Try to get current token (may be null if already deleted)
  const token = await getToken(messaging, {
    vapidKey: VAPID_PUBLIC_KEY,
    serviceWorkerRegistration: reg
  });

  if (token) {
    await setDoc(
      doc(db, "push_subscribers", token),
      {
        enabled: false,
        disabledAt: new Date().toISOString()
      },
      { merge: true }
    );
  }

  await deleteToken(messaging);
}

/**
 * Optional: listen for messages while the page is in the foreground.
 */
export function onForegroundMessage(cb) {
  return onMessage(messaging, (payload) => cb?.(payload));
}
