import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Navigation, Heart, MapPin, Zap, Battery, Search } from 'lucide-react';
import LoadingSpinner from '../UI/LoadingSpinner';
import { showToast } from '../UI/Toast';
import { isFavorite } from '../../utils/db';
import { useEffect } from 'react';

function StationListItem({ station }) {
  const { userLocation, toggleFavorite } = useApp();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const fav = await isFavorite(station.id);
        setIsFav(fav);
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
    checkFavorite();
  }, [station.id]);

  const handleNavigate = () => {
    if (!userLocation) {
      showToast('Location not available', 'error');
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${station.latitude},${station.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(station);
    setIsFav(!isFav);
    showToast(
      isFav ? 'Removed from favorites' : 'Added to favorites',
      'success'
    );
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
            <span>{station.distance.toFixed(1)} km away</span>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)} animate-pulse`} />
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
        {station.address}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {station.chargerTypes.level2 && (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium flex items-center space-x-1">
            <Battery className="w-3 h-3" />
            <span>Level 2</span>
          </span>
        )}
        {station.chargerTypes.dcFast && (
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
          onClick={handleToggleFavorite}
          className={`px-3 py-2 rounded-lg transition-colors ${
            isFav
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default function ListView() {
  const { getFilteredStations, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'name', 'status'

  const filteredStations = getFilteredStations();

  const searchedStations = filteredStations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedStations = [...searchedStations].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return a.distance - b.distance;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'status':
        const statusOrder = { available: 0, unknown: 1, occupied: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Search and Sort Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white text-sm"
          >
            <option value="distance">Distance</option>
            <option value="name">Name</option>
            <option value="status">Availability</option>
          </select>
        </div>
      </div>

      {/* Station List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading stations..." />
          </div>
        ) : sortedStations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <MapPin className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No stations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedStations.map((station) => (
              <StationListItem key={station.id} station={station} />
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      {sortedStations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Showing {sortedStations.length} {sortedStations.length === 1 ? 'station' : 'stations'}
          </p>
        </div>
      )}
    </div>
  );
}
