/**
 * Vaccinbussen Service Worker - PWA Offline Functionality
 * @description Caching strategy för svenska hälsovårdstjänster
 * @version 1.0 - Production Ready
 */

const CACHE_NAME = 'vaccinbussen-v1.0';
const RUNTIME = 'runtime-cache';

// Essential files för offline functionality
const CACHE_URLS = [
  '/',
  '/vaccination-i-bjarred/',
  '/manifest.json',
  '/offline.html',
  // CSS och JS kommer från EpiServer bundling
  // Bilder cacheas dynamiskt
];

// Install event - cache essential resources
self.addEventListener('install', event => {
  console.log('SW: Installing Vaccinbussen Service Worker');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching essential files');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            console.log('SW: Deleting old cache:', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - cache strategy for Swedish healthcare
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Cache strategies based on request type
  if (event.request.destination === 'document') {
    // HTML pages - Network first, cache fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone response for cache
          const responseClone = response.clone();
          caches.open(RUNTIME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cache, then offline page
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
  } else if (event.request.destination === 'image') {
    // Images - Cache first, network fallback
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request).then(response => {
            // Only cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(RUNTIME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
  } else {
    // Other resources - Network first
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
  }
});

// Background sync för offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'vaccination-booking') {
    event.waitUntil(syncVaccinationData());
  }
});

async function syncVaccinationData() {
  try {
    // Hämta offline-lagrad bokningsdata
    const bookings = await getOfflineBookings();
    
    for (const booking of bookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking)
        });
        
        if (response.ok) {
          // Ta bort från offline storage
          await removeOfflineBooking(booking.id);
          console.log('SW: Booking synced successfully');
        }
      } catch (error) {
        console.error('SW: Failed to sync booking:', error);
      }
    }
  } catch (error) {
    console.error('SW: Background sync failed:', error);
  }
}

// Push notifications för vaccinationsschema
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nya vaccinationstider tillgängliga i Björred',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    tag: 'vaccination-update',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Visa schema'
      },
      {
        action: 'close',
        title: 'Stäng'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Vaccinbussen Björred',
      options
    )
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/vaccination-i-bjarred/')
    );
  }
});

// Helper functions för offline storage
async function getOfflineBookings() {
  try {
    const cache = await caches.open('offline-data');
    const response = await cache.match('/offline-bookings');
    if (response) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('SW: Error getting offline bookings:', error);
    return [];
  }
}

async function removeOfflineBooking(bookingId) {
  try {
    const bookings = await getOfflineBookings();
    const updatedBookings = bookings.filter(b => b.id !== bookingId);
    
    const cache = await caches.open('offline-data');
    await cache.put('/offline-bookings', new Response(JSON.stringify(updatedBookings)));
  } catch (error) {
    console.error('SW: Error removing offline booking:', error);
  }
}

console.log('SW: Vaccinbussen Service Worker loaded successfully');