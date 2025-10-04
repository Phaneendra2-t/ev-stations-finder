import { Battery, Moon, Sun, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { darkMode, setDarkMode, refreshStations, isLoading } = useApp();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Battery className="w-6 h-6 text-primary-500" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            EV Charger Finder
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshStations}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            aria-label="Refresh stations"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
