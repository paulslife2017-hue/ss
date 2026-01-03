// K-Beauty Seoul Service Worker
// Version 1.0.0 - 2025-12-14

const CACHE_NAME = 'kbeauty-seoul-v1.0.0';
const STATIC_CACHE = 'kbeauty-static-v1';
const IMAGE_CACHE = 'kbeauty-images-v1';
const DYNAMIC_CACHE = 'kbeauty-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/static/style.css',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== IMAGE_CACHE && 
                cacheName !== DYNAMIC_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy: Cache-First for images
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Strategy: Network-First for HTML (to get latest content)
  if (request.mode === 'navigate' || request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Strategy: Cache-First for static assets (CSS, JS, fonts)
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font' ||
      url.pathname.match(/\.(css|js|woff|woff2|ttf|otf)$/i)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Default: Network-First for everything else
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

// Cache-First Strategy (good for images, static assets)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[Service Worker] Cache hit:', request.url);
      return cached;
    }
    
    console.log('[Service Worker] Cache miss, fetching:', request.url);
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Fetch error:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    
    throw error;
  }
}

// Network-First Strategy (good for HTML, dynamic content)
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('[Service Worker] Network-first for:', request.url);
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Network error, trying cache:', error);
    
    const cached = await caches.match(request);
    if (cached) {
      console.log('[Service Worker] Returning cached version');
      return cached;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) return offlinePage;
    }
    
    throw error;
  }
}

// Background sync for offline actions (optional enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    console.log('[Service Worker] Syncing offline bookings...');
    event.waitUntil(syncOfflineBookings());
  }
});

async function syncOfflineBookings() {
  // Implement booking sync logic here
  console.log('[Service Worker] Booking sync completed');
}

// Push notifications (optional enhancement)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'K-Beauty Seoul';
  const options = {
    body: data.body || 'New updates available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

console.log('[Service Worker] Loaded successfully');
