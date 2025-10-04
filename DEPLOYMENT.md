# Deployment Guide

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Pros**: Zero config, automatic HTTPS, global CDN, free tier

**Steps**:
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow prompts and your app will be live!

**Custom Domain**:
```bash
vercel --prod
vercel domains add yourdomain.com
```

**Environment Variables**:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add `VITE_OPENCHARGEMAP_API_KEY` if needed

---

### Option 2: Netlify

**Pros**: Simple drag-and-drop, automatic HTTPS, free tier

**Steps**:

**Method A: Drag & Drop**
1. Build: `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag `/dist` folder
4. Done!

**Method B: CLI**
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

**Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Pros**: Free, integrated with GitHub, simple

**Steps**:

1. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   });
   ```

2. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

3. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to repo Settings → Pages
   - Source: gh-pages branch
   - Save

**Note**: GitHub Pages doesn't support HTTPS for custom domains on free tier. PWA features require HTTPS.

---

### Option 4: Firebase Hosting

**Pros**: Google infrastructure, free tier, automatic HTTPS

**Steps**:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login:
   ```bash
   firebase login
   ```

3. Initialize:
   ```bash
   firebase init hosting
   ```
   - Select: Use existing project or create new
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub integration: Optional

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

**Configuration** (`firebase.json`):
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/service-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

---

### Option 5: AWS S3 + CloudFront

**Pros**: Scalable, professional, full control

**Steps**:

1. Create S3 bucket:
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Upload:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. Configure bucket for static hosting:
   - Enable static website hosting
   - Set index.html as index document
   - Set error document to index.html (for SPA routing)

5. Create CloudFront distribution:
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Custom error pages: 404 → /index.html (200)

**Automated Deployment** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to S3
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: 'dist'
```

---

### Option 6: Docker + Any Cloud

**Pros**: Portable, consistent, works anywhere

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /service-worker.js {
        add_header Cache-Control "no-cache";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build and run**:
```bash
docker build -t ev-charger-app .
docker run -p 80:80 ev-charger-app
```

**Deploy to**:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## 🔒 Pre-Deployment Checklist

### Security
- [ ] HTTPS enabled
- [ ] API keys in environment variables
- [ ] No sensitive data in code
- [ ] Content Security Policy configured
- [ ] CORS headers set

### Performance
- [ ] Production build optimized
- [ ] Assets compressed (gzip/brotli)
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Bundle size analyzed

### PWA
- [ ] Service worker registered
- [ ] Manifest.json valid
- [ ] Icons all sizes present
- [ ] Offline mode tested
- [ ] Install prompt works

### SEO
- [ ] Meta tags set
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Canonical URLs

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (if needed)
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Testing
- [ ] All tests pass
- [ ] Cross-browser tested
- [ ] Mobile tested
- [ ] Lighthouse score >90

---

## 🌍 Custom Domain Setup

### DNS Configuration

Add these records to your DNS provider:

**For Vercel/Netlify**:
```
Type: CNAME
Name: www
Value: your-app.vercel.app (or netlify.app)

Type: A
Name: @
Value: [Provider's IP]
```

**For CloudFront**:
```
Type: CNAME
Name: www
Value: d123456.cloudfront.net

Type: A (Alias)
Name: @
Value: CloudFront distribution
```

### SSL Certificate

Most platforms provide free SSL via Let's Encrypt automatically.

For custom setup:
- Use Certbot for Let's Encrypt
- Or CloudFlare for free SSL

---

## 📊 Post-Deployment

### Verify Deployment

1. **PWA Check**:
   - Open Chrome DevTools → Application
   - Check service worker registered
   - Check manifest loaded
   - Test offline mode

2. **Lighthouse Audit**:
   ```bash
   lighthouse https://yourdomain.com --view
   ```

3. **Test on Real Devices**:
   - iOS Safari
   - Android Chrome
   - Desktop browsers

### Monitor Performance

**Tools**:
- Google Analytics (optional)
- Sentry for error tracking
- Vercel Analytics
- Cloudflare Analytics

**Key Metrics**:
- Page load time
- Time to interactive
- Error rate
- User engagement

---

## 🔄 Continuous Deployment

### GitHub Actions Example

`.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_OPENCHARGEMAP_API_KEY: ${{ secrets.API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🆘 Troubleshooting

### Service Worker Not Updating
```bash
# Clear service worker
# Chrome DevTools → Application → Service Workers → Unregister

# Force update
# Add to code:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.update());
});
```

### 404 on Refresh
Configure server to redirect all routes to index.html (SPA routing)

### CORS Issues
Add CORS headers on server or use proxy in development

### Build Fails
```bash
# Clear cache
rm -rf node_modules dist .vite
npm install
npm run build
```

---

## 📈 Scaling

### CDN
- Use CloudFlare for free CDN
- Or provider's built-in CDN

### Caching Strategy
```javascript
// In vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        maps: ['leaflet', 'react-leaflet'],
      }
    }
  }
}
```

### Performance Budget
- Main bundle: < 500KB
- Total size: < 2MB
- Load time: < 3s

---

## 🎉 You're Live!

After deployment:
1. Test thoroughly
2. Monitor errors
3. Gather user feedback
4. Iterate and improve

**Share your app**:
- Social media
- Product Hunt
- Reddit communities
- EV forums

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
