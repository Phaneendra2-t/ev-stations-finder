import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchNearbyStations, getMockStations } from '../utils/api';
import { cacheStations, getCachedStations, getFavorites, isFavorite as checkFavorite } from '../utils/db';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [stations, setStations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [filters, setFilters] = useState({
    showLevel2: true,
    showDCFast: true,
    showAvailable: true,
    showOccupied: true,
    showUnknown: true,
    maxDistance: 25,
  });
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          setIsLoading(false);
          resolve(location);
        },
        (error) => {
          setIsLoading(false);
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          setError(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }, []);

  const loadStations = useCallback(async (location = userLocation, useCache = false) => {
    if (!location) {
      setError('Location not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let stationData;

      if (isOffline || useCache) {
        // Load from cache
        stationData = await getCachedStations();
        if (stationData.length === 0) {
          // Use mock data if no cache
          stationData = getMockStations(location.latitude, location.longitude);
        }
      } else {
        // Fetch from API
        try {
          stationData = await fetchNearbyStations(
            location.latitude,
            location.longitude,
            50,
            filters.maxDistance
          );
          
          // Cache the results
          await cacheStations(stationData);
        } catch (apiError) {
          console.error('API fetch failed, using cached data:', apiError);
          stationData = await getCachedStations();
          
          if (stationData.length === 0) {
            stationData = getMockStations(location.latitude, location.longitude);
          }
        }
      }

      setStations(stationData);
    } catch (err) {
      console.error('Error loading stations:', err);
      setError('Failed to load charging stations. Please try again.');
      
      // Fallback to mock data
      const mockData = getMockStations(location.latitude, location.longitude);
      setStations(mockData);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, isOffline, filters.maxDistance]);

  const refreshStations = useCallback(async () => {
    if (userLocation) {
      await loadStations(userLocation, false);
    }
  }, [userLocation, loadStations]);

  const getFilteredStations = useCallback(() => {
    return stations.filter(station => {
      // Filter by charger type
      if (!filters.showLevel2 && station.chargerTypes.level2 && !station.chargerTypes.dcFast) {
        return false;
      }
      if (!filters.showDCFast && station.chargerTypes.dcFast) {
        return false;
      }

      // Filter by status
      if (!filters.showAvailable && station.status === 'available') return false;
      if (!filters.showOccupied && station.status === 'occupied') return false;
      if (!filters.showUnknown && station.status === 'unknown') return false;

      return true;
    });
  }, [stations, filters]);

  const toggleFavorite = useCallback(async (station) => {
    try {
      const { addFavorite, removeFavorite, isFavorite } = await import('../utils/db');
      const isFav = await isFavorite(station.id);
      
      if (isFav) {
        await removeFavorite(station.id);
      } else {
        await addFavorite(station);
      }
      
      await loadFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Failed to update favorites');
    }
  }, []);

  const value = {
    userLocation,
    setUserLocation,
    stations,
    favorites,
    selectedStation,
    setSelectedStation,
    isLoading,
    isOffline,
    error,
    setError,
    isInitialized,
    setIsInitialized,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    showHeatmap,
    setShowHeatmap,
    darkMode,
    setDarkMode,
    getUserLocation,
    loadStations,
    refreshStations,
    getFilteredStations,
    toggleFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
