import { subscribeToDevotional, unsubscribeFromDevotional } from "./push.js";

export function wirePushControls({ subBtnSelector = "#btn-sub", unsubBtnSelector = "#btn-unsub", statusSelector = "#push-status" } = {}) {
  const btnSub   = document.querySelector(subBtnSelector);
  const btnUnsub = document.querySelector(unsubBtnSelector);
  const statusEl = document.querySelector(statusSelector);

  if (!btnSub || !btnUnsub || !statusEl) return;

  btnSub.addEventListener("click", async () => {
    try {
      await subscribeToDevotional();
      statusEl.textContent = "Subscribed! You’ll get the daily devotional.";
      btnSub.style.display = "none";
      btnUnsub.style.display = "inline-block";
    } catch (e) {
      console.error(e);
      statusEl.textContent = e?.message || "Could not subscribe. Check browser settings.";
    }
  });

  btnUnsub.addEventListener("click", async () => {
    try {
      await unsubscribeFromDevotional();
      statusEl.textContent = "Unsubscribed. You can re-enable anytime.";
      btnSub.style.display = "inline-block";
      btnUnsub.style.display = "none";
    } catch (e) {
      console.error(e);
      statusEl.textContent = "Error while unsubscribing. Try again.";
    }
  });
}
