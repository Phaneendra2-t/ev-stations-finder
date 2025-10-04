import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import BottomNav from './BottomNav';
import Toast from '../UI/Toast';
import OfflineBanner from '../UI/OfflineBanner';
import LoadingSpinner from '../UI/LoadingSpinner';

export default function MainLayout({ children }) {
  const { getUserLocation, loadStations, userLocation, isInitialized, setIsInitialized } = useApp();
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Get user location on mount
        const location = await getUserLocation();
        if (mounted) {
          await loadStations(location);
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Failed to initialize:', err);
        if (mounted) {
          setInitError(err.message);
          // Still mark as initialized to show the app
          setIsInitialized(true);
        }
      }
    };

    if (!isInitialized) {
      initialize();
    }

    return () => {
      mounted = false;
    };
  }, [getUserLocation, loadStations, isInitialized, setIsInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" text="Initializing EV Charger Finder..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <OfflineBanner />
      {initError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {initError} - You can still use the app with limited functionality.
          </p>
        </div>
      )}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      <BottomNav />
      <Toast />
    </div>
  );
}
