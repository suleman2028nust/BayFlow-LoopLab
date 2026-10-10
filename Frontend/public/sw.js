// BayFlow Service Worker for Web Push & Notifications
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "BayFlow Workshop Alert", body: "You have a new update." };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || data.message || "New activity recorded in BayFlow.",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    data: data,
    tag: data.id || `bayflow-notif-${Date.now()}`,
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || "BayFlow Alert", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.link || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if ("focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
