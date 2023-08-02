// Increment this number to trigger offline clients to update their caches:
// v3

self.addEventListener('install', e => {
  self.skipWaiting();

  e.waitUntil(
    caches
      .open('qr-detector.js')
      .then(c =>
        c.addAll([
          'https://cdn.jsdelivr.net/gh/stefansundin/qr-detector.js@v0.0.5/dist/QrDetector.min.js',
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
          'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
          'https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.slim.min.js',
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

  if (e.request.method === 'POST' && e.request.url.endsWith('/share')) {
    e.respondWith(Response.redirect(self.registration.scope));
    e.waitUntil(
      (async function () {
        const data = await e.request.formData();
        const file = data.get('file');
        const client = await self.clients.get(
          e.resultingClientId || e.clientId,
        );
        client.postMessage({
          action: 'detect',
          file,
        });
      })(),
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
