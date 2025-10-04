# Quick Reference Guide

## 🚀 One-Minute Setup
```bash
npm install && node create-icons.js && npm run dev
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component with routing |
| `src/context/AppContext.jsx` | Global state management |
| `src/utils/api.js` | API integration & data fetching |
| `src/utils/db.js` | IndexedDB operations |
| `vite.config.js` | Build & PWA configuration |
| `tailwind.config.js` | Styling configuration |

## 🎯 Common Tasks

### Change App Colors
```javascript
// tailwind.config.js
colors: {
  primary: { 500: '#10b981' } // Your color here
}
```

### Add API Key
```javascript
// src/utils/api.js
const API_KEY = 'your-key-here';
```

### Modify Default Location
```javascript
// src/components/Views/MapView.jsx
const defaultCenter = [37.7749, -122.4194]; // [lat, lng]
```

### Change App Name
```javascript
// vite.config.js
manifest: {
  name: 'Your App Name',
  short_name: 'Short Name'
}
```

## 🧩 Component Structure

```
App
├── MainLayout
│   ├── Header (logo, dark mode, refresh)
│   ├── OfflineBanner (shows when offline)
│   ├── Routes
│   │   ├── MapView (default route)
│   │   ├── ListView
│   │   ├── FavoritesView
│   │   └── SettingsView
│   ├── BottomNav (mobile navigation)
│   └── Toast (notifications)
```

## 🔌 API Endpoints

### OpenChargeMap
```javascript
// Get nearby stations
GET https://api.openchargemap.io/v3/poi?
  latitude={lat}&
  longitude={lng}&
  distance={km}&
  maxresults={n}
```

## 💾 Data Storage

### IndexedDB Stores
- `favorites` - Saved stations
- `stations` - Cached station data
- `preferences` - User settings

### LocalStorage
- `darkMode` - Theme preference

## 🎨 Styling Classes

### Status Colors
```css
.status-available  /* Green - bg-green-500 */
.status-occupied   /* Red - bg-red-500 */
.status-unknown    /* Gray - bg-gray-400 */
```

### Common Utilities
```css
.custom-scrollbar  /* Styled scrollbar */
.offline-mode      /* Grayscale filter */
.animate-pulse     /* Pulsing animation */
```

## 🔧 Scripts

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🐛 Debug Commands

### Clear Service Worker
```javascript
// Browser console
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));
```

### Clear Cache
```javascript
// Browser console
caches.keys().then(keys => 
  Promise.all(keys.map(key => caches.delete(key)))
);
```

### Clear IndexedDB
```javascript
// Browser console
indexedDB.deleteDatabase('ev-charger-db');
```

### Clear All Data
```javascript
// Browser console
localStorage.clear();
sessionStorage.clear();
```

## 📊 Performance Tips

1. **Reduce Bundle Size**
   - Lazy load components
   - Tree-shake unused code
   - Optimize images

2. **Improve Load Time**
   - Enable compression (gzip/brotli)
   - Use CDN for assets
   - Preload critical resources

3. **Optimize Map**
   - Limit visible stations
   - Disable heatmap for large datasets
   - Use marker clustering

## 🔒 Security Checklist

- [ ] HTTPS enabled
- [ ] API keys in .env
- [ ] No sensitive data in code
- [ ] CORS configured
- [ ] CSP headers set

## 📱 PWA Checklist

- [ ] manifest.json valid
- [ ] All icons present (8 sizes)
- [ ] Service worker registered
- [ ] Offline mode works
- [ ] Install prompt appears

## 🧪 Testing Checklist

- [ ] Location permission flow
- [ ] Map loads correctly
- [ ] Filters work
- [ ] Navigation opens Maps
- [ ] Favorites persist
- [ ] Offline mode works
- [ ] Dark mode toggles
- [ ] PWA installs

## 🚀 Deployment Quick Steps

### Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### GitHub Pages
```bash
npm install -D gh-pages
npm run deploy
```

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Icons not showing | Run `node create-icons.js` |
| Location denied | Check browser permissions |
| Map not loading | Check internet connection |
| Service worker error | Unregister and refresh |
| Build fails | Clear node_modules, reinstall |
| Offline mode broken | Check service worker registration |

## 📞 Quick Links

- [Full Documentation](README.md)
- [Setup Guide](SETUP.md)
- [Testing Guide](TESTING.md)
- [Deployment Guide](DEPLOYMENT.md)
- [FAQ](FAQ.md)

## 💡 Pro Tips

1. **Development**: Use React DevTools for debugging
2. **Performance**: Run Lighthouse audits regularly
3. **Mobile**: Test on real devices, not just emulators
4. **Offline**: Test with DevTools Network → Offline
5. **PWA**: Use Application tab in DevTools
6. **Icons**: Use PWA Asset Generator for production
7. **API**: Get OpenChargeMap key for higher limits
8. **Maps**: Consider Mapbox for advanced features

## 🎓 Learning Path

1. **Beginner**: Understand React basics and component structure
2. **Intermediate**: Learn Context API and custom hooks
3. **Advanced**: Explore PWA features and service workers
4. **Expert**: Optimize performance and add advanced features

## 📚 Essential Reading

- React Hooks: `useState`, `useEffect`, `useContext`, `useCallback`
- Leaflet API: Markers, popups, layers, heatmaps
- PWA: Service workers, manifest, caching strategies
- Tailwind: Utility classes, responsive design, dark mode

## 🔄 Update Workflow

1. Check for updates: `npm outdated`
2. Update dependencies: `npm update`
3. Test thoroughly
4. Update changelog
5. Commit and deploy

## 🎯 Feature Flags

```javascript
// .env
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=false
VITE_MAX_STATIONS=50
VITE_DEFAULT_RADIUS=25
```

## 🌐 Environment Variables

```bash
# .env.local (not committed)
VITE_OPENCHARGEMAP_API_KEY=your_key
VITE_GOOGLE_MAPS_API_KEY=your_key
VITE_APP_NAME=EV Charger Finder
```

## 📦 Build Output

```
dist/
├── index.html           # Entry point
├── assets/
│   ├── index-[hash].js  # Main bundle
│   ├── index-[hash].css # Styles
│   └── vendor-[hash].js # Dependencies
├── icons/               # PWA icons
├── manifest.webmanifest # PWA manifest
└── sw.js               # Service worker
```

## 🎨 Color Palette

```css
Primary:   #10b981 (Green)
Secondary: #3b82f6 (Blue)
Success:   #10b981 (Green)
Error:     #ef4444 (Red)
Warning:   #f59e0b (Orange)
Info:      #3b82f6 (Blue)
```

## 📐 Breakpoints

```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Tab | Navigate between elements |
| Enter/Space | Activate buttons |
| Escape | Close modals/panels |
| Arrow keys | Navigate map |
| +/- | Zoom map |

## 🔍 Browser DevTools

### Chrome
- F12: Open DevTools
- Ctrl+Shift+P: Command palette
- Ctrl+Shift+M: Device toolbar
- Ctrl+Shift+I: Inspect element

### Useful Panels
- **Console**: Errors and logs
- **Network**: API calls and caching
- **Application**: PWA, storage, service workers
- **Lighthouse**: Performance audits
- **Performance**: Runtime analysis

---

**Print this page for quick reference while developing!**

**Last Updated**: October 2025 | **Version**: 1.0.0
