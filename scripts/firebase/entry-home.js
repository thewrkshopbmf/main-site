// scripts/firebase/entry-home.js
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
