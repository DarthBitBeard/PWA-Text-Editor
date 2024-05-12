const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],  // Cache successful responses and opaque responses
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,  // Cache items for 30 days
    }),
  ],
});

// Warm up the page cache with important URLs
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

// Use CacheFirst strategy for navigation requests
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implement asset caching for CSS, JavaScript, and images
registerRoute(
  // Match assets based on file extension
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'image',
  new CacheFirst({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],  // Cache successful responses and opaque responses
      }),
      new ExpirationPlugin({
        maxEntries: 60,  // Limit the number of items in the cache
        maxAgeSeconds: 30 * 24 * 60 * 60,  // Cache items for 30 days
        purgeOnQuotaError: true,  // Automatically delete items if quota is exceeded
      }),
    ],
  }),
);

// Optionally, cache other types of content, such as fonts, with StaleWhileRevalidate for things that might update frequently
registerRoute(
  ({ request }) => request.destination === 'font',
  new StaleWhileRevalidate({
    cacheName: 'font-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 30,  // Less aggressive caching for fonts, which might update more often
        maxAgeSeconds: 60 * 60 * 24 * 365,  // Cache for up to one year
      }),
    ],
  }),
);
