self.addEventListener(
	"install",
	function (event) {
		event.waitUntil(
			caches
				.open("sirrch-pwa")
				.then(function (cache) {
					return cache.addAll([
						"/",
						"/index.html",
						"/index.css",
						"/icon.png",
						"/index.js",
					]);
				})
		);
	}
);

self.addEventListener(
	"fetch",
	function (event) {
		event.respondWith(
			caches
				.match(event.request)
				.then(function (response) {
					return (
						response ||
						fetch(event.request)
					);
				})
		);
	}
);
