// Eleventy based
// eslint-disable-next-line no-console
console.log(
  `%c  .petergoes %c{ front-end: %c developer%c; }  `,
  'background: #263238; color: #FFD47E; border-radius: 3px 0 0 3px;',
  'background: #263238; color: #8FD2CE; border-radius: 0 3px 3px 0; font-weight: 400;',
  'background: #263238; color: #BED5DD; border-radius: 0 3px 3px 0; font-weight: 400;',
  'background: #263238; color: #8FD2CE; border-radius: 0 3px 3px 0; font-weight: 400;',
)

self.addEventListener('install', function(event) {
  var offlineRequest = new Request('offline/index.html');
  event.waitUntil(
    fetch(offlineRequest).then(function(response) {
      return caches.open('offline').then(function(cache) {
        // eslint-disable-next-line no-console
        console.log('[oninstall] Cached offline page', response.url);
        return cache.put(offlineRequest, response);
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request).catch(function(error) {
        // eslint-disable-next-line no-console
        console.log(
          '⚠️ [onfetch] Failed. Serving cached offline fallback ' +
          error
        );
        return caches.open('offline').then(function(cache) {
          return cache.match('offline/index.html');
        });
      })
    );
  }
});
