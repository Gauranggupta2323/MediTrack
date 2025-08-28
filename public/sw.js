// Service Worker for MediTrack
// Handles background notifications and caching

const CACHE_NAME = 'meditrack-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/static/css/globals.css',
  '/favicon.ico',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const medicationName = event.notification.data?.medicationName;

  if (action === 'taken') {
    // Handle "Mark as Taken" action
    event.waitUntil(
      self.registration.showNotification(`${medicationName} marked as taken`, {
        tag: 'medication-taken',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      })
    );
  } else if (action === 'snooze') {
    // Handle "Snooze" action - reschedule for 10 minutes
    const snoozeTime = new Date(Date.now() + 10 * 60 * 1000);
    
    event.waitUntil(
      self.registration.showNotification(`Reminder snoozed for 10 minutes`, {
        tag: 'medication-snoozed',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      })
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});

// Background sync for medication logs
self.addEventListener('sync', (event) => {
  if (event.tag === 'medication-log') {
    event.waitUntil(syncMedicationLogs());
  }
});

async function syncMedicationLogs() {
  try {
    // Get pending medication logs from IndexedDB
    const logs = await getPendingLogs();
    
    for (const log of logs) {
      try {
        const response = await fetch('/api/medication-logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(log),
        });

        if (response.ok) {
          // Remove from pending logs if successful
          await removePendingLog(log.id);
        }
      } catch (error) {
        console.error('Failed to sync medication log:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for IndexedDB operations
async function getPendingLogs() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MediTrackDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingLogs'], 'readonly');
      const store = transaction.objectStore('pendingLogs');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function removePendingLog(logId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MediTrackDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['pendingLogs'], 'readwrite');
      const store = transaction.objectStore('pendingLogs');
      const deleteRequest = store.delete(logId);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}
