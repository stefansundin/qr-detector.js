self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open('qr-detector.js')
      .then(c =>
        c.addAll([
          'https://cdn.jsdelivr.net/gh/stefansundin/qr-detector.js@v0.0.3/dist/QrDetector.min.js',
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
          'QrDetector.min.js',
          'demo.css',
          'demo.js',
          'worker.js',
          'icon.png',
        ]),
      ),
  );
});

self.addEventListener('fetch', e => {
  // console.log(e.request.url);
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
