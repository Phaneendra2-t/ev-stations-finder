# EV Charging Station Finder PWA

A responsive Progressive Web App (PWA) for locating nearby Electric Vehicle (EV) charging stations with real-time availability data, route planning, and visual heatmaps.

## 🚀 Features

### Core Functionality
- **Geolocation & Nearby Search**: Instantly find the 10 closest charging stations using browser geolocation
- **Real-Time Availability**: Live updates on station occupancy with 30-second polling
- **Route Integration**: One-tap navigation to Google Maps with ETA and directions
- **Heatmap Visualization**: Bird's-eye view of charger density with toggle layers
- **Offline Capability**: Full PWA support with cached maps and station data via service workers

### User Experience
- **Mobile-First Design**: Optimized for on-the-go drivers
- **Dark Mode**: Automatic theme switching for better visibility
- **Filter System**: Filter by charger type (Level 2/DC Fast), availability status, and distance
- **Favorites**: Save frequently used stations for quick access
- **List & Map Views**: Switch between map visualization and detailed list view

### Technical Highlights
- **PWA Installable**: Add to home screen for native app-like experience
- **Offline Support**: Service worker caching with Workbox
- **IndexedDB Storage**: Persistent local storage for favorites and cached data
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: IndexedDB (via idb)
- **PWA**: Vite PWA Plugin with Workbox
- **API**: OpenChargeMap API (free, global coverage)

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-of-devil
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create icon assets**
   
   Create a `/public/icons` directory and add PNG icons in the following sizes:
   - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
   
   You can use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) or create them manually.

4. **Configure API (Optional)**
   
   The app works with OpenChargeMap's public API without a key, but for higher rate limits:
   - Get a free API key from [OpenChargeMap](https://openchargemap.org/site/develop/api)
   - Update `src/utils/api.js`:
     ```javascript
     const API_KEY = 'your-api-key-here';
     ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

6. **Build for production**
   ```bash
   npm run build
   ```
   
   The optimized build will be in the `/dist` directory.

7. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Usage

### First Launch
1. Grant location permission when prompted
2. The app will automatically load nearby charging stations
3. Explore stations on the map or switch to list view

### Finding Stations
- **Map View**: See stations as pins with color-coded availability
  - Green: Available
  - Red: Occupied
  - Gray: Unknown status
- **List View**: Browse stations sorted by distance, name, or availability
- **Filters**: Use the filter panel to narrow results by charger type and distance

### Navigation
1. Select a station from the map or list
2. Tap "Navigate" to open Google Maps with directions
3. Share station location via the share button

### Offline Mode
- The app automatically caches station data and map tiles
- When offline, you'll see a banner with cached data
- Favorites are always available offline

### Installing as PWA
- **iOS**: Tap Share → Add to Home Screen
- **Android**: Tap menu → Install App
- **Desktop**: Look for install prompt in address bar

## 📱 Screenshots

*(Add screenshots of your app here)*

## 🔧 Configuration

### Customizing Filters
Edit `src/context/AppContext.jsx` to change default filter values:
```javascript
const [filters, setFilters] = useState({
  showLevel2: true,
  showDCFast: true,
  showAvailable: true,
  showOccupied: true,
  showUnknown: true,
  maxDistance: 25, // km
});
```

### Adjusting Cache Duration
Modify cache expiration in `vite.config.js`:
```javascript
expiration: {
  maxEntries: 100,
  maxAgeSeconds: 60 * 30 // 30 minutes
}
```

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981) - Eco-friendly theme
- **Secondary**: Blue (#3b82f6) - Navigation elements
- **Status Colors**:
  - Available: Green (#10b981)
  - Occupied: Red (#ef4444)
  - Unknown: Gray (#9ca3af)

### Typography
- System fonts for optimal performance
- Responsive font sizes with Tailwind utilities

## 🧪 Testing

### Manual Testing Checklist
- [ ] Geolocation permission flow
- [ ] Station markers display correctly
- [ ] Filter functionality works
- [ ] Navigation opens Google Maps
- [ ] Favorites persist after reload
- [ ] Offline mode shows cached data
- [ ] Dark mode toggles correctly
- [ ] PWA installs on mobile devices

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: ✓

### Optimizations
- Lazy loading of map components
- Image optimization for icons
- Code splitting with React Router
- Service worker caching strategy
- Debounced API calls

## 🔐 Privacy & Security

- **Location Data**: Stored locally, never transmitted to third parties
- **API Calls**: Only to OpenChargeMap for station data
- **No Tracking**: No analytics or user tracking
- **HTTPS Required**: PWA requires secure context

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [OpenChargeMap](https://openchargemap.org/) for the charging station API
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles
- [Leaflet](https://leafletjs.com/) for map functionality
- [Lucide](https://lucide.dev/) for beautiful icons

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the FAQ section

## 🗺️ Roadmap

### Future Enhancements
- [ ] User reviews and ratings for stations
- [ ] Battery drain estimation based on vehicle type
- [ ] Reservation system integration
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Voice navigation
- [ ] AR navigation overlay
- [ ] Social features (share routes with friends)

## 📊 API Rate Limits

OpenChargeMap API (without key):
- 100 requests per day per IP
- Consider getting a free API key for higher limits

## 🐛 Known Issues

- Heatmap may be slow with 500+ stations
- iOS Safari requires user gesture for geolocation
- Service worker updates require page reload

## 💡 Tips

1. **Better Performance**: Enable "Reduce Motion" in accessibility settings if animations lag
2. **Data Usage**: Use offline mode in areas with poor connectivity
3. **Battery Saving**: Disable auto-refresh in settings when not needed
4. **Accuracy**: Ensure location services are enabled for best results

---

**Built with ❤️ for the EV community**
