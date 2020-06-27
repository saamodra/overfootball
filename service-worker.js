const CACHE_NAME = "overfootball-v2";
var urlsToCache = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/images/icons/icon-72x72.png",
  "/images/icons/icon-96x96.png",
  "/images/icons/icon-128x128.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-384x384.png",
  "/images/icons/icon-512x512.png",
  "/images/header-img2.png",
  "/images/logo-2.png",
  "/images/Overfootball.png",
  "/images/Overfootball-1.png",
  "/images/schedule.jpg",
  "/images/standings.jpg",
  "/images/teams.jpg",
  "/nav.html",
  "/index.html",
  "/jadwal.html",
  "/tim.html",
  "/klasemen.html",
  "/detailtim.html",
  "/saved.html",
  '/css/style.css',
  '/css/apercu.css',
  "/css/materialize.min.css",
  "/css/materialize.css",
  "/fonts/Apercu_Bold.otf",
  "/fonts/Apercu_Light.otf",
  "/fonts/Apercu_Regular.otf",
  "/js/materialize.js",
  "/js/materialize.min.js",
  "/js/idb.js",
  "/js/db.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/serviceworker.js"
];

self.addEventListener('install', function(event){
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
})

self.addEventListener('activate', function(event){
	event.waitUntil(
		caches.keys()
		.then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(cacheName != CACHE_NAME){	
						console.log("ServiceWorker: cache " + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
})


self.addEventListener("fetch", function(event) {
  var base_url = "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function(response) {
            return response || fetch (event.request);
        })
    )
}
});

self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/notification.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});