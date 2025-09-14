/* global importScripts, firebase */
// The messaging SW still uses the compat build (this is Firebase's recommended path)
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js");

// Keep config minimal; measurementId not required in SW
firebase.initializeApp({
  apiKey: "AIzaSyD5XBi3PzVPlZeFy541TVWwwiKqbIjkvpk",
  authDomain: "thewrkshop-pushnoti.firebaseapp.com",
  projectId: "thewrkshop-pushnoti",
  messagingSenderId: "540768640641",
  appId: "1:540768640641:web:fd24a4c026a1ef801c3780"
});

const messaging = firebase.messaging();

// Show a notification when your site is closed
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "TheWrkShop";
  const options = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon-192.png",
    data: { url: payload.data?.url || "/" }
  };
  self.registration.showNotification(title, options);
});

// Clicking the notification opens the devotional
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) { client.navigate(url); return client.focus(); }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
