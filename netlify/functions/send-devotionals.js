import admin from "firebase-admin";

// Netlify env var: FIREBASE_SERVICE_ACCOUNT must contain the full JSON (stringified)
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}");

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

function buildNotification() {
  // Keep short; include a link
  const title = "Today’s Lamp Check ✨";
  const body  = "A 30-second nudge from Psalm 119:105. Tap to read.";
  const url   = "https://thewrkshop.com/daily/today?src=push";
  return { title, body, url };
}

export default async () => {
  const { title, body, url } = buildNotification();

  // Fanout: tokens are doc IDs
  const snap = await db.collection("push_subscribers").where("enabled", "==", true).get();
  const tokens = snap.docs.map(d => d.id);
  if (!tokens.length) return { statusCode: 200, body: "No subscribers" };

  const messaging = admin.messaging();
  const chunkSize = 500;
  let success = 0, failure = 0;

  for (let i = 0; i < tokens.length; i += chunkSize) {
    const batch = tokens.slice(i, i + chunkSize);
    const res = await messaging.sendEachForMulticast({
      notification: { title, body },
      data: { url },
      tokens: batch
    });

    success += res.successCount;
    failure += res.failureCount;

    // Clean invalid tokens
    await Promise.all(res.responses.map(async (r, idx) => {
      if (!r.success) {
        const code = r.error?.code || "";
        if (code.includes("registration-token-not-registered") || code.includes("invalid-argument")) {
          await db.collection("push_subscribers").doc(batch[idx])
            .set({ enabled: false, disabledAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
        }
      }
    }));
  }

  return { statusCode: 200, body: `Push sent. Success: ${success}, Failure: ${failure}` };
};
