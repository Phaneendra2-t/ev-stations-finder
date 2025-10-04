import { X, Zap, Battery, Circle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function FilterPanel({ onClose }) {
  const { filters, setFilters } = useApp();

  const handleToggle = (key) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  const handleDistanceChange = (e) => {
    setFilters({ ...filters, maxDistance: parseInt(e.target.value) });
  };

  return (
    <div className="h-full w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          aria-label="Close filters"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Charger Types */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Charger Type
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showLevel2}
                onChange={() => handleToggle('showLevel2')}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Battery className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Level 2</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showDCFast}
                onChange={() => handleToggle('showDCFast')}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Zap className="w-5 h-5 text-purple-500" />
                <span className="text-gray-700 dark:text-gray-300">DC Fast Charge</span>
              </div>
            </label>
          </div>
        </div>

        {/* Availability Status */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Availability
          </h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showAvailable}
                onChange={() => handleToggle('showAvailable')}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Circle className="w-4 h-4 fill-green-500 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">Available</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOccupied}
                onChange={() => handleToggle('showOccupied')}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Circle className="w-4 h-4 fill-red-500 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Occupied</span>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showUnknown}
                onChange={() => handleToggle('showUnknown')}
                className="w-5 h-5 text-primary-500 rounded focus:ring-2 focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2 flex-1">
                <Circle className="w-4 h-4 fill-gray-400 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Unknown Status</span>
              </div>
            </label>
          </div>
        </div>

        {/* Distance Range */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Maximum Distance
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={filters.maxDistance}
              onChange={handleDistanceChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">5 km</span>
              <span className="font-medium text-primary-500">
                {filters.maxDistance} km
              </span>
              <span className="text-gray-500 dark:text-gray-400">100 km</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() =>
            setFilters({
              showLevel2: true,
              showDCFast: true,
              showAvailable: true,
              showOccupied: true,
              showUnknown: true,
              maxDistance: 25,
            })
          }
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
