import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

// If a user arrives via notification link "...?src=push", log an event
export function logPushClickIfPresent() {
  const params = new URLSearchParams(location.search);
  if (params.get("src") === "push") {
    logEvent(analytics, "devotional_push_click", { path: location.pathname });
  }
}
