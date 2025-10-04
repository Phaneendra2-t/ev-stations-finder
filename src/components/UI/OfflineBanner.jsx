import { WifiOff, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineBanner() {
  const { isOffline, refreshStations } = useApp();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-yellow-500 text-white overflow-hidden"
        >
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-5 h-5" />
              <span className="text-sm font-medium">
                You're offline. Showing cached data.
              </span>
            </div>
            <button
              onClick={refreshStations}
              className="flex items-center space-x-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              aria-label="Sync when online"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Sync</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
