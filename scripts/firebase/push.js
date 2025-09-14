import { messaging, db } from "./firebase.js";
import { getToken, deleteToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

// Get this from Firebase Console → Cloud Messaging → Web configuration → "Key pair" (VAPID public key)
const VAPID_PUBLIC_KEY = "PUT_YOUR_VAPID_PUBLIC_KEY_HERE";

// Ensure the messaging SW is registered at site root
export async function ensureServiceWorkerReady() {
  if (!("serviceWorker" in navigator)) throw new Error("Service workers not supported");
  const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
  return reg;
}

export async function subscribeToDevotional() {
  const perm = await Notification.requestPermission();
  if (perm !== "granted") throw new Error("Notifications blocked by the browser");

  const reg   = await ensureServiceWorkerReady();
  const token = await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY, serviceWorkerRegistration: reg });
  if (!token) throw new Error("Failed to get FCM token");

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Chicago";

  // Store token as document id; super simple fanout
  await setDoc(doc(db, "push_subscribers", token), {
    enabled: true,
    timezone: tz,
    createdAt: new Date().toISOString()
  }, { merge: true });

  return token;
}

export async function unsubscribeFromDevotional() {
  const reg   = await ensureServiceWorkerReady();
  const token = await getToken(messaging, { vapidKey: VAPID_PUBLIC_KEY, serviceWorkerRegistration: reg });

  // Best effort: mark disabled server-side + delete client token
  if (token) {
    await setDoc(doc(db, "push_subscribers", token), {
      enabled: false,
      disabledAt: new Date().toISOString()
    }, { merge: true });
  }
  await deleteToken(messaging);
}

export function onForegroundMessage(cb) {
  // Receive messages while page is in the foreground (optional)
  return onMessage(messaging, (payload) => cb?.(payload));
}
