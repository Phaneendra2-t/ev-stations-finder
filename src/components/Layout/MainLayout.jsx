import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import BottomNav from './BottomNav';
import Toast from '../UI/Toast';
import OfflineBanner from '../UI/OfflineBanner';

export default function MainLayout({ children }) {
  const { getUserLocation, loadStations, userLocation } = useApp();

  useEffect(() => {
    // Get user location on mount
    getUserLocation().then((location) => {
      loadStations(location);
    }).catch((err) => {
      console.error('Failed to get location:', err);
    });
  }, [getUserLocation, loadStations]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <OfflineBanner />
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
      <BottomNav />
      <Toast />
    </div>
  );
}
