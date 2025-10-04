import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import StationCard from '../Station/StationCard';
import FilterPanel from '../Station/FilterPanel';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Layers, Filter } from 'lucide-react';

// Import heatmap loader
import { loadHeatmapPlugin } from '../../utils/loadHeatmap';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (status) => {
  const colors = {
    available: '#10b981',
    occupied: '#ef4444',
    unknown: '#9ca3af',
  };

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="position: relative;">
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${colors[status]}"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

const userLocationIcon = L.divIcon({
  className: 'custom-marker-icon',
  html: `
    <div class="relative">
      <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}

function HeatmapLayer({ stations, show }) {
  const map = useMap();
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  useEffect(() => {
    if (show) {
      loadHeatmapPlugin().then(loaded => {
        setHeatmapLoaded(loaded);
      });
    }
  }, [show]);

  useEffect(() => {
    if (!show || !stations.length || !heatmapLoaded) return;
    
    // Check if L.heatLayer is available
    if (typeof L.heatLayer !== 'function') {
      console.warn('Heatmap feature not available');
      return;
    }

    try {
      const points = stations.map(station => [
        station.latitude,
        station.longitude,
        0.5, // intensity
      ]);

      const heatLayer = L.heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: '#3b82f6',
          0.5: '#10b981',
          1.0: '#ef4444',
        },
      }).addTo(map);

      return () => {
        try {
          map.removeLayer(heatLayer);
        } catch (e) {
          console.warn('Error removing heatmap layer');
        }
      };
    } catch (error) {
      console.error('Error creating heatmap:', error);
    }
  }, [map, stations, show, heatmapLoaded]);

  return null;
}

export default function MapView() {
  const {
    userLocation,
    selectedStation,
    setSelectedStation,
    isLoading,
    getFilteredStations,
    showHeatmap,
    setShowHeatmap,
    isOffline,
    error,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [mapError, setMapError] = useState(null);
  
  const filteredStations = getFilteredStations();

  const defaultCenter = [37.7749, -122.4194]; // San Francisco
  const mapCenter = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  // Handle map errors
  useEffect(() => {
    const handleError = (e) => {
      console.error('Map error:', e);
      setMapError('Failed to load map. Please refresh the page.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div className={`h-full w-full ${isOffline ? 'offline-mode' : ''}`}>
        {isLoading && !filteredStations.length ? (
          <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <LoadingSpinner size="lg" text="Loading charging stations..." />
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full z-0"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapController center={mapCenter} zoom={13} />
            
            {showHeatmap && (
              <HeatmapLayer stations={filteredStations} show={showHeatmap} />
            )}

            {/* User location marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={userLocationIcon}
              >
                <Popup>
                  <div className="text-sm font-medium">Your Location</div>
                </Popup>
              </Marker>
            )}

            {/* Station markers */}
            {!showHeatmap && filteredStations.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
                icon={createCustomIcon(station.status)}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-semibold text-sm mb-1">{station.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{station.address}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{station.distance.toFixed(1)} km away</span>
                      <span className={`px-2 py-1 rounded-full text-white ${
                        station.status === 'available' ? 'bg-green-500' :
                        station.status === 'occupied' ? 'bg-red-500' : 'bg-gray-400'
                      }`}>
                        {station.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`p-3 rounded-lg shadow-lg transition-colors ${
            showHeatmap
              ? 'bg-primary-500 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
          aria-label="Toggle heatmap"
        >
          <Layers className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-gray-700 dark:text-gray-300"
          aria-label="Toggle filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: 300 }}
          className="absolute top-0 right-0 h-full z-[1000]"
        >
          <FilterPanel onClose={() => setShowFilters(false)} />
        </motion.div>
      )}

      {/* Selected Station Card */}
      {selectedStation && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="absolute bottom-4 left-4 right-4 z-[1000]"
        >
          <StationCard
            station={selectedStation}
            onClose={() => setSelectedStation(null)}
          />
        </motion.div>
      )}

      {/* Station Count Badge */}
      <div className="absolute bottom-4 right-4 z-[999] bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {filteredStations.length} stations
        </span>
      </div>
    </div>
  );
}
