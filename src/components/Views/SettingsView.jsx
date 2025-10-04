import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { savePreference, getPreference, clearOldCache } from '../../utils/db';
import { showToast } from '../UI/Toast';
import {
  Settings,
  Moon,
  Sun,
  MapPin,
  Database,
  Info,
  Trash2,
  Download,
  Shield,
} from 'lucide-react';

export default function SettingsView() {
  const { darkMode, setDarkMode, getUserLocation, userLocation } = useApp();
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [cacheSize, setCacheSize] = useState('Calculating...');

  useEffect(() => {
    loadPreferences();
    calculateCacheSize();
  }, []);

  const loadPreferences = async () => {
    const autoRefreshPref = await getPreference('autoRefresh');
    const intervalPref = await getPreference('refreshInterval');
    
    if (autoRefreshPref !== undefined) setAutoRefresh(autoRefreshPref);
    if (intervalPref !== undefined) setRefreshInterval(intervalPref);
  };

  const calculateCacheSize = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage / (1024 * 1024)).toFixed(2);
        setCacheSize(`${usedMB} MB`);
      } else {
        setCacheSize('Not available');
      }
    } catch (err) {
      console.error('Error calculating cache size:', err);
      setCacheSize('Unknown');
    }
  };

  const handleAutoRefreshToggle = async () => {
    const newValue = !autoRefresh;
    setAutoRefresh(newValue);
    await savePreference('autoRefresh', newValue);
    showToast(
      `Auto-refresh ${newValue ? 'enabled' : 'disabled'}`,
      'success'
    );
  };

  const handleIntervalChange = async (e) => {
    const value = parseInt(e.target.value);
    setRefreshInterval(value);
    await savePreference('refreshInterval', value);
  };

  const handleClearCache = async () => {
    try {
      await clearOldCache(0); // Clear all cache
      await calculateCacheSize();
      showToast('Cache cleared successfully', 'success');
    } catch (err) {
      console.error('Error clearing cache:', err);
      showToast('Failed to clear cache', 'error');
    }
  };

  const handleRequestLocation = async () => {
    try {
      await getUserLocation();
      showToast('Location updated successfully', 'success');
    } catch (err) {
      showToast('Failed to get location', 'error');
    }
  };

  const handleInstallPWA = () => {
    showToast('To install: tap Share button and select "Add to Home Screen"', 'info', 5000);
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Settings className="w-7 h-7 text-primary-500" />
            <span>Settings</span>
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Customize your EV Charger Finder experience
          </p>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            <span>Appearance</span>
          </h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use dark theme for better visibility at night
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-primary-500' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">Current Location</p>
              {userLocation ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Location not available
                </p>
              )}
            </div>
            
            <button
              onClick={handleRequestLocation}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
            >
              Update Location
            </button>
          </div>
        </div>

        {/* Auto-Refresh */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Refresh</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-Refresh</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically update station data
                </p>
              </div>
              <button
                onClick={handleAutoRefreshToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefresh ? 'bg-primary-500' : 'bg-gray-300'
                }`}
                aria-label="Toggle auto-refresh"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {autoRefresh && (
              <div>
                <label className="block font-medium text-gray-900 dark:text-white mb-2">
                  Refresh Interval: {refreshInterval} seconds
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="10"
                  value={refreshInterval}
                  onChange={handleIntervalChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10s</span>
                  <span>120s</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Storage */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Storage</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Cache Size</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stored offline data
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {cacheSize}
              </span>
            </div>
            
            <button
              onClick={handleClearCache}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cache</span>
            </button>
          </div>
        </div>

        {/* PWA Install */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Install App</span>
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Install this app on your home screen for quick access and offline support
            </p>
            <button
              onClick={handleInstallPWA}
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Install Instructions</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Info className="w-5 h-5" />
            <span>About</span>
          </h2>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Data Source:</strong> OpenChargeMap API</p>
            <p><strong>Features:</strong> Real-time availability, offline support, route planning</p>
            <p className="flex items-center space-x-1 pt-2">
              <Shield className="w-4 h-4" />
              <span>Your location data is stored locally and never shared</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
