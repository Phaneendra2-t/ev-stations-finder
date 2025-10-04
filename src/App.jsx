import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import MapView from './components/Views/MapView';
import ListView from './components/Views/ListView';
import FavoritesView from './components/Views/FavoritesView';
import SettingsView from './components/Views/SettingsView';

function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/list" element={<ListView />} />
            <Route path="/favorites" element={<FavoritesView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </MainLayout>
      </Router>
    </AppProvider>
  );
}

export default App;
