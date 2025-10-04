import { X, Navigation, Heart, Zap, MapPin, Clock, DollarSign, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { showToast } from '../UI/Toast';
import { useState, useEffect } from 'react';
import { isFavorite } from '../../utils/db';

export default function StationCard({ station, onClose }) {
  const { userLocation, toggleFavorite } = useApp();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [station.id]);

  const checkFavorite = async () => {
    const fav = await isFavorite(station.id);
    setIsFav(fav);
  };

  const handleNavigate = () => {
    if (!userLocation) {
      showToast('Location not available', 'error');
      return;
    }

    // Open in Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${station.latitude},${station.longitude}&travelmode=driving`;
    window.open(url, '_blank');
    showToast('Opening navigation...', 'success');
  };

  const handleShare = async () => {
    const shareData = {
      title: station.name,
      text: `Check out this EV charging station: ${station.name}`,
      url: `https://www.google.com/maps?q=${station.latitude},${station.longitude}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        showToast('Link copied to clipboard!', 'success');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
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

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">{station.name}</h2>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <span>{station.distance.toFixed(1)} km away</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(station.status)} animate-pulse`} />
            <span className="font-medium text-gray-900 dark:text-white">
              {getStatusText(station.status)}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {station.numberOfPoints} {station.numberOfPoints === 1 ? 'port' : 'ports'}
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{station.address}</span>
        </div>

        {/* Charger Types */}
        <div className="flex flex-wrap gap-2">
          {station.chargerTypes.level2 && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
              Level 2
            </span>
          )}
          {station.chargerTypes.dcFast && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>DC Fast</span>
            </span>
          )}
        </div>

        {/* Connections Details */}
        {station.connections && station.connections.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Available Connectors
            </h3>
            <div className="space-y-1">
              {station.connections.map((conn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {conn.type} ({conn.level})
                  </span>
                  <div className="flex items-center space-x-2">
                    {conn.powerKW > 0 && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {conn.powerKW} kW
                      </span>
                    )}
                    <span className="text-gray-500 dark:text-gray-400">
                      ×{conn.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>{station.usageCost}</span>
          </div>
          {station.operator && (
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <span className="font-medium">Operator:</span>
              <span>{station.operator}</span>
            </div>
          )}
        </div>

        {station.lastUpdated && (
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>
              Updated: {new Date(station.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleNavigate}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
          >
            <Navigation className="w-4 h-4" />
            <span>Navigate</span>
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors font-medium ${
              isFav
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
