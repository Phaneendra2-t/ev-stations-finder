import { openDB } from 'idb';

const DB_NAME = 'ev-charger-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Store for favorite stations
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }

      // Store for cached station data
      if (!db.objectStoreNames.contains('stations')) {
        const stationStore = db.createObjectStore('stations', { keyPath: 'id' });
        stationStore.createIndex('lastUpdated', 'lastUpdated');
      }

      // Store for user preferences
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'key' });
      }
    },
  });
}

// Favorites operations
export async function addFavorite(station) {
  const db = await initDB();
  await db.put('favorites', { ...station, addedAt: Date.now() });
}

export async function removeFavorite(stationId) {
  const db = await initDB();
  await db.delete('favorites', stationId);
}

export async function getFavorites() {
  const db = await initDB();
  return db.getAll('favorites');
}

export async function isFavorite(stationId) {
  const db = await initDB();
  const favorite = await db.get('favorites', stationId);
  return !!favorite;
}

// Station cache operations
export async function cacheStations(stations) {
  const db = await initDB();
  const tx = db.transaction('stations', 'readwrite');
  const timestamp = Date.now();
  
  await Promise.all([
    ...stations.map(station => 
      tx.store.put({ ...station, lastUpdated: timestamp })
    ),
    tx.done
  ]);
}

export async function getCachedStations() {
  const db = await initDB();
  return db.getAll('stations');
}

export async function clearOldCache(maxAge = 24 * 60 * 60 * 1000) {
  const db = await initDB();
  const stations = await db.getAll('stations');
  const now = Date.now();
  
  const tx = db.transaction('stations', 'readwrite');
  await Promise.all([
    ...stations
      .filter(s => now - s.lastUpdated > maxAge)
      .map(s => tx.store.delete(s.id)),
    tx.done
  ]);
}

// Preferences operations
export async function savePreference(key, value) {
  const db = await initDB();
  await db.put('preferences', { key, value });
}

export async function getPreference(key) {
  const db = await initDB();
  const pref = await db.get('preferences', key);
  return pref?.value;
}
