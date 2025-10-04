# Frequently Asked Questions (FAQ)

## 🚀 Getting Started

### Q: How do I run this project?
**A:** Follow these steps:
```bash
npm install
node create-icons.js  # Generate icons
npm run dev
```
The app will open at `http://localhost:3000`

### Q: Do I need an API key?
**A:** No, the OpenChargeMap API works without a key, but with rate limits (100 requests/day). For higher limits, get a free key at [OpenChargeMap](https://openchargemap.org/site/develop/api).

### Q: Why aren't the icons showing?
**A:** You need to generate them first:
1. Run `node create-icons.js` to create SVG icons
2. Or open `generate-icons.html` in a browser
3. Save the icons to `/public/icons/` directory
4. Ensure all 8 sizes are present (72, 96, 128, 144, 152, 192, 384, 512)

---

## 🗺️ Features & Functionality

### Q: How does the app find my location?
**A:** The app uses the browser's Geolocation API. You'll be prompted to allow location access on first use. If denied, you can manually update your location in Settings.

### Q: Why are some stations showing as "Unknown" status?
**A:** Not all charging stations report real-time availability. The status depends on:
- Station operator's API integration
- Last update timestamp
- Network connectivity

### Q: Can I use this app without internet?
**A:** Yes! After the first load:
- The app caches station data
- Map tiles are stored locally
- Favorites work offline
- You'll see an offline banner when disconnected

### Q: How accurate is the distance calculation?
**A:** Distances are calculated using the Haversine formula (straight-line distance). Actual driving distance may vary. Tap "Navigate" for accurate route distance via Google Maps.

### Q: What's the difference between Level 2 and DC Fast charging?
**A:**
- **Level 2**: 7-19 kW, 4-8 hours for full charge (home/workplace)
- **DC Fast**: 50-350 kW, 20-60 minutes for 80% charge (highway/public)

---

## 🔧 Technical Questions

### Q: What browsers are supported?
**A:** 
- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile, Samsung Internet

### Q: Why isn't the PWA installing on my device?
**A:** PWA installation requires:
- HTTPS (or localhost for development)
- Valid manifest.json
- Registered service worker
- All required icons present

For iOS, use "Add to Home Screen" from the Share menu.

### Q: How much storage does the app use?
**A:** Approximately:
- App shell: ~2MB
- Cached map tiles: ~10-50MB (depends on usage)
- Station data: ~1-5MB
- Total: Usually under 60MB

Check Settings → Storage for your actual usage.

### Q: Can I use this with my own API?
**A:** Yes! Edit `src/utils/api.js` to integrate any charging station API. The data transformation function can be adapted to different API formats.

---

## 🎨 Customization

### Q: How do I change the app colors?
**A:** Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#10b981', // Change this to your color
  }
}
```

### Q: Can I add more languages?
**A:** Currently, the app is English-only. To add i18n:
1. Install `react-i18next`
2. Create translation files
3. Wrap text in `t()` function
4. Add language selector in Settings

### Q: How do I change the default map center?
**A:** Edit `src/components/Views/MapView.jsx`:
```javascript
const defaultCenter = [37.7749, -122.4194]; // [latitude, longitude]
```

### Q: Can I use Google Maps instead of Leaflet?
**A:** Yes, but you'll need:
1. Google Maps API key
2. Replace Leaflet components with `@react-google-maps/api`
3. Update map-related components

---

## 📱 Mobile & PWA

### Q: How do I install the app on iPhone?
**A:**
1. Open in Safari (not Chrome)
2. Tap the Share button (square with arrow)
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Q: Why doesn't the app work offline on first visit?
**A:** The service worker needs to cache resources on the first load. After the initial visit with internet, offline mode will work.

### Q: Can I use this app in airplane mode?
**A:** Yes, if you've used it before with internet. The app will show cached stations and your last known location.

### Q: Does the app drain my battery?
**A:** The app is optimized for battery life:
- GPS is used only when needed
- Auto-refresh can be disabled in Settings
- Dark mode reduces screen power consumption
- Map rendering is hardware-accelerated

---

## 🔒 Privacy & Security

### Q: Is my location data shared?
**A:** No. Your location is:
- Stored only in your browser
- Never sent to our servers (we don't have any!)
- Only used to find nearby stations
- Can be cleared anytime

### Q: What data does the app collect?
**A:** The app collects NO personal data. It only:
- Fetches public charging station data from OpenChargeMap
- Stores your preferences locally (dark mode, favorites)
- Caches map tiles for offline use

### Q: Is it safe to use on public WiFi?
**A:** Yes, especially if deployed with HTTPS. The app doesn't transmit sensitive data. However, always use caution on public networks.

---

## 🐛 Troubleshooting

### Q: The map isn't loading. What should I do?
**A:**
1. Check your internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Disable browser extensions
4. Try a different browser
5. Check browser console for errors (F12)

### Q: I'm getting "Location permission denied" error
**A:**
1. Check browser settings (chrome://settings/content/location)
2. Ensure HTTPS is enabled (required for geolocation)
3. Try a different browser
4. Manually enter location in Settings

### Q: Stations aren't updating
**A:**
1. Check if you're online (look for offline banner)
2. Tap the refresh button in header
3. Clear cache in Settings
4. Check API rate limits (100/day without key)

### Q: The app is slow/laggy
**A:**
1. Disable heatmap (toggle layers button)
2. Reduce filter distance
3. Clear old cache in Settings
4. Close other browser tabs
5. Update your browser

### Q: Service worker won't update
**A:**
1. Chrome DevTools → Application → Service Workers
2. Click "Unregister"
3. Hard refresh (Ctrl+Shift+R)
4. Or click "Update on reload"

### Q: Dark mode isn't working
**A:**
1. Toggle dark mode in header
2. Check if browser has forced dark mode
3. Clear localStorage: `localStorage.clear()`
4. Refresh the page

---

## 🚀 Deployment

### Q: Where can I deploy this app?
**A:** Many options:
- **Easiest**: Vercel, Netlify (free tier)
- **Free**: GitHub Pages, Firebase Hosting
- **Professional**: AWS S3+CloudFront, Google Cloud
- **Containerized**: Docker on any cloud

See `DEPLOYMENT.md` for detailed guides.

### Q: Do I need a server?
**A:** No! This is a static site that can be hosted anywhere. It only needs:
- Static file hosting
- HTTPS support (for PWA features)
- SPA routing support (redirect all routes to index.html)

### Q: How do I set up a custom domain?
**A:**
1. Deploy to your chosen platform
2. Add CNAME record in DNS settings
3. Configure SSL certificate (usually automatic)
4. Update manifest.json with new domain

### Q: Can I monetize this app?
**A:** Yes, you can:
- Add affiliate links to EV products
- Display ads (respect user experience)
- Offer premium features (reservations, reviews)
- Partner with charging networks

---

## 📊 Performance

### Q: How can I improve performance?
**A:**
1. Enable production build: `npm run build`
2. Use CDN for static assets
3. Enable compression (gzip/brotli)
4. Optimize images
5. Reduce filter distance
6. Disable animations (Settings)

### Q: What's the target Lighthouse score?
**A:** We aim for:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: ✓ All checks

### Q: Why is the bundle size large?
**A:** Main contributors:
- Leaflet library (~150KB)
- React (~130KB)
- Map tiles (cached separately)

This is normal for a map-based app. The app uses code splitting to load only what's needed.

---

## 🔄 Updates & Maintenance

### Q: How do I update dependencies?
**A:**
```bash
npm outdated          # Check for updates
npm update            # Update minor versions
npm install pkg@latest  # Update specific package
```

### Q: How often should I update?
**A:** 
- Security updates: Immediately
- Feature updates: Monthly
- Major versions: Quarterly (test thoroughly)

### Q: Will my data be lost after updates?
**A:** No. User data (favorites, preferences) is stored in IndexedDB and persists across updates.

---

## 🤝 Contributing

### Q: Can I contribute to this project?
**A:** Absolutely! We welcome:
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- Translations

See the Contributing section in README.md.

### Q: I found a bug. What should I do?
**A:**
1. Check if it's already reported (GitHub Issues)
2. Try to reproduce it
3. Note your environment (browser, OS, device)
4. Open a new issue with details
5. Include screenshots if possible

### Q: How do I suggest a feature?
**A:**
1. Check existing feature requests
2. Open a GitHub issue with "Feature Request" label
3. Describe the use case
4. Explain the expected behavior
5. Add mockups if possible

---

## 📚 Learning

### Q: I'm new to React. Can I learn from this project?
**A:** Yes! This project demonstrates:
- React Hooks (useState, useEffect, useContext)
- Context API for state management
- React Router for navigation
- Component composition
- Custom hooks
- Error handling

### Q: What should I learn to understand this code?
**A:** Prerequisites:
- JavaScript ES6+ (async/await, destructuring, modules)
- React basics (components, props, state)
- CSS/Tailwind basics
- Basic understanding of APIs
- Git/GitHub

### Q: Are there any tutorials for similar projects?
**A:** Check out:
- [React Documentation](https://react.dev/learn)
- [PWA Tutorial](https://web.dev/progressive-web-apps/)
- [Leaflet Tutorials](https://leafletjs.com/examples.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## 💡 Best Practices

### Q: What are the best practices used in this project?
**A:**
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Progressive enhancement
- Error boundaries
- Loading states
- Optimistic UI updates
- Semantic HTML
- Component composition
- Clean code principles

### Q: How is the code organized?
**A:**
- Components by feature (Layout, Views, UI, Station)
- Utils for shared logic
- Context for global state
- Separation of concerns
- Single responsibility principle

---

## 🎯 Use Cases

### Q: Who is this app for?
**A:**
- EV owners looking for charging stations
- Road trip planners
- Fleet managers
- EV enthusiasts
- Developers learning PWA development

### Q: Can I use this for commercial purposes?
**A:** Yes! The project is MIT licensed. You can:
- Use it commercially
- Modify it
- Distribute it
- Sublicense it

Just include the original license.

### Q: Can I white-label this app?
**A:** Absolutely! You can:
- Change branding (colors, logo, name)
- Add custom features
- Integrate with your API
- Deploy under your domain

---

## 🆘 Still Need Help?

If your question isn't answered here:

1. **Check Documentation**
   - README.md
   - SETUP.md
   - TESTING.md
   - DEPLOYMENT.md

2. **Search Issues**
   - GitHub Issues tab
   - Closed issues might have answers

3. **Browser Console**
   - Press F12
   - Check for error messages
   - Look in Console and Network tabs

4. **Ask the Community**
   - Open a GitHub Discussion
   - Stack Overflow (tag: react, pwa)
   - Reddit: r/reactjs, r/webdev

5. **Contact**
   - Open a GitHub issue
   - Provide detailed information
   - Include error messages and screenshots

---

**Last Updated**: October 2025  
**Version**: 1.0.0

**Have a question not listed here?** Open an issue and we'll add it to the FAQ!
