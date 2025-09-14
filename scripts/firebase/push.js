// scripts/firebase/entry-home.js

// Register the SW early; push.js will still wait on navigator.serviceWorker.ready
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => {});
}

import { wirePushControls } from "./push-ui.js";
import { logPushClickIfPresent } from "./analytics-hook.js";

// Only run if supported
const controls = document.getElementById("push-controls");
if ("Notification" in window && "serviceWorker" in navigator && controls) {
  wirePushControls();
  logPushClickIfPresent();

  // iOS hint shows only on iPhone/iPad
  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  if (!isIOS) document.querySelector(".ios-hint")?.remove();
} else {
  controls?.remove();
}
