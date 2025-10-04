import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getFavorites } from '../../utils/db';
import { Heart, Navigation, MapPin, Zap, Battery, Trash2 } from 'lucide-react';
import { showToast } from '../UI/Toast';
import LoadingSpinner from '../UI/LoadingSpinner';

function FavoriteStationCard({ station, onRemove }) {
  const { userLocation } = useApp();

  const handleNavigate = () => {
    if (!userLocation) {
      showToast('Location not available', 'error');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${station.latitude},${station.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {station.name}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{station.address}</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)} animate-pulse`} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {station.chargerTypes?.level2 && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium flex items-center space-x-1">
            <Battery className="w-3 h-3" />
            <span>Level 2</span>
          </span>
        )}
        {station.chargerTypes?.dcFast && (
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>DC Fast</span>
          </span>
        )}
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
          {station.numberOfPoints} {station.numberOfPoints === 1 ? 'port' : 'ports'}
        </span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleNavigate}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Navigation className="w-4 h-4" />
          <span>Navigate</span>
        </button>
        <button
          onClick={() => onRemove(station)}
          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          aria-label="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function FavoritesView() {
  const { toggleFavorite } = useApp();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (err) {
      console.error('Error loading favorites:', err);
      showToast('Failed to load favorites', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (station) => {
    await toggleFavorite(station);
    showToast('Removed from favorites', 'success');
    loadFavorites();
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <Heart className="w-6 h-6 text-red-500 fill-current" />
          <span>Favorite Stations</span>
        </h2>
        {favorites.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {favorites.length} {favorites.length === 1 ? 'station' : 'stations'} saved
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading favorites..." />
          </div>
        ) : favorites.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Heart className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">
              Start adding your frequently used charging stations to quickly access them later
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((station) => (
              <FavoriteStationCard
                key={station.id}
                station={station}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
