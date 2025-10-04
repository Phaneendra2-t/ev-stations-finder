# Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Generate Icons
Choose one of these methods:

**Method A: Using Node.js (Recommended)**
```bash
node create-icons.js
```
This creates SVG icons. For PNG conversion, use an online tool or ImageMagick.

**Method B: Using Browser**
1. Open `generate-icons.html` in your browser
2. Click "Generate Icons"
3. Right-click each icon and save to `/public/icons/`

**Method C: Use Existing Icons**
If you have a logo, use [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator):
```bash
npx pwa-asset-generator logo.png public/icons
```

### Step 3: Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Step 4: Test PWA Features

1. **Location Permission**: Grant when prompted
2. **View Stations**: See nearby charging stations on map
3. **Test Offline**: 
   - Open DevTools → Network tab
   - Check "Offline" checkbox
   - Reload page - should still work!
4. **Install PWA**:
   - Chrome: Look for install icon in address bar
   - Mobile: Add to Home Screen

## 🔧 Configuration

### API Key (Optional)
For higher rate limits, get a free key from [OpenChargeMap](https://openchargemap.org/site/develop/api):

Edit `src/utils/api.js`:
```javascript
const API_KEY = 'your-api-key-here';
```

### Customize Theme
Edit `tailwind.config.js` to change colors:
```javascript
colors: {
  primary: {
    500: '#10b981', // Change this
  }
}
```

## 📱 Testing on Mobile

### Local Network Testing
1. Find your computer's IP address:
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig`
2. Run dev server: `npm run dev`
3. On mobile, visit: `http://YOUR_IP:3000`

### HTTPS for PWA Testing
PWAs require HTTPS. Use one of these:

**Option 1: ngrok**
```bash
npm install -g ngrok
npm run dev
# In another terminal:
ngrok http 3000
```

**Option 2: Vite HTTPS**
Edit `vite.config.js`:
```javascript
server: {
  https: true,
  port: 3000
}
```

## 🏗️ Building for Production

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy
The `/dist` folder contains your production build. Deploy to:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag `/dist` to netlify.com/drop
- **GitHub Pages**: 
  ```bash
  npm run build
  git add dist -f
  git commit -m "Deploy"
  git subtree push --prefix dist origin gh-pages
  ```

## 🐛 Troubleshooting

### Icons Not Showing
- Ensure `/public/icons/` directory exists
- Check all 8 sizes are present (72, 96, 128, 144, 152, 192, 384, 512)
- Clear browser cache and reload

### Location Not Working
- Check browser permissions (chrome://settings/content/location)
- HTTPS is required for geolocation in production
- Try manual location entry in Settings view

### Map Not Loading
- Check internet connection
- Verify OpenStreetMap tiles are accessible
- Check browser console for errors

### Service Worker Issues
- Clear all site data in DevTools → Application → Storage
- Unregister service worker
- Hard refresh (Ctrl+Shift+R)

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Performance Optimization

### Lighthouse Audit
```bash
npm run build
npm run preview
# Open Chrome DevTools → Lighthouse → Generate Report
```

### Optimize Bundle Size
```bash
npm run build -- --mode production
# Check bundle size in dist/assets/
```

## 🔐 Security Checklist

- [ ] HTTPS enabled in production
- [ ] API keys in environment variables (not committed)
- [ ] Content Security Policy configured
- [ ] CORS headers set correctly
- [ ] No sensitive data in localStorage

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

## 💡 Development Tips

### Hot Module Replacement
Vite supports HMR - changes appear instantly without full reload.

### React DevTools
Install [React DevTools](https://react.dev/learn/react-developer-tools) for debugging.

### VS Code Extensions
Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

### Debug Service Worker
Chrome DevTools → Application → Service Workers
- View registered workers
- Update on reload
- Bypass for network

## 🎯 Next Steps

1. **Customize Branding**: Update colors, logo, and app name
2. **Add Analytics**: Integrate privacy-friendly analytics
3. **Enhance Features**: Add user reviews, reservations, etc.
4. **Optimize Performance**: Code splitting, lazy loading
5. **Test Thoroughly**: Cross-browser and device testing
6. **Deploy**: Choose hosting platform and deploy

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review code comments for implementation details
- Open an issue on GitHub
- Check browser console for error messages

---

**Happy Coding! 🚗⚡**
