# Testing Guide

## 🧪 Testing Checklist

### Functional Testing

#### Geolocation & Search
- [ ] Location permission prompt appears on first load
- [ ] User location marker appears on map after permission granted
- [ ] Nearby stations load automatically after location obtained
- [ ] Manual location entry works in Settings
- [ ] Location denial shows appropriate error message
- [ ] Fallback to manual search when geolocation unavailable

#### Map View
- [ ] Map loads with OpenStreetMap tiles
- [ ] Station markers appear with correct colors (green/red/gray)
- [ ] Clicking marker shows popup with basic info
- [ ] Clicking marker opens detailed station card
- [ ] User location marker is distinct and visible
- [ ] Map zoom controls work
- [ ] Map pan/drag works smoothly
- [ ] Heatmap toggle shows/hides density overlay
- [ ] Heatmap colors represent station density correctly

#### List View
- [ ] All stations display in list format
- [ ] Search filters stations by name and address
- [ ] Sort by distance works correctly
- [ ] Sort by name works alphabetically
- [ ] Sort by availability prioritizes available stations
- [ ] Station cards show all relevant information
- [ ] Navigate button opens Google Maps
- [ ] Favorite button toggles correctly

#### Filters
- [ ] Filter panel opens/closes smoothly
- [ ] Level 2 filter shows/hides Level 2 chargers
- [ ] DC Fast filter shows/hides fast chargers
- [ ] Availability filters work (available/occupied/unknown)
- [ ] Distance slider updates results in real-time
- [ ] Reset filters button restores defaults
- [ ] Filter count updates correctly
- [ ] Filters persist during session

#### Station Details
- [ ] Station card displays all information
- [ ] Status indicator shows correct color and animation
- [ ] Charger types display with appropriate badges
- [ ] Connection details list all connectors
- [ ] Navigate button opens Google Maps with directions
- [ ] Share button works (native share or clipboard)
- [ ] Favorite button adds/removes from favorites
- [ ] Close button dismisses card

#### Favorites
- [ ] Adding favorite saves to IndexedDB
- [ ] Favorites persist after page reload
- [ ] Favorites view shows all saved stations
- [ ] Remove button deletes from favorites
- [ ] Empty state shows when no favorites
- [ ] Favorite icon fills when station is favorited

#### Settings
- [ ] Dark mode toggle works immediately
- [ ] Dark mode preference persists
- [ ] Location update button requests new location
- [ ] Auto-refresh toggle enables/disables
- [ ] Refresh interval slider updates value
- [ ] Cache size displays correctly
- [ ] Clear cache button works
- [ ] Install instructions show appropriate message

#### Navigation
- [ ] Bottom navigation highlights current view
- [ ] All navigation items work
- [ ] Back button behavior is correct
- [ ] URL updates with route changes

### PWA Features

#### Installation
- [ ] Install prompt appears (desktop)
- [ ] Add to Home Screen works (mobile)
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode
- [ ] Splash screen shows during launch

#### Offline Functionality
- [ ] Service worker registers successfully
- [ ] App shell caches on first load
- [ ] Map tiles cache for offline use
- [ ] Station data caches
- [ ] Offline banner appears when offline
- [ ] Cached data displays when offline
- [ ] Sync button appears in offline mode
- [ ] App works without internet after first load

#### Updates
- [ ] Service worker update prompt appears
- [ ] Reload updates to new version
- [ ] No data loss during update

### Performance Testing

#### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] Map renders within 2 seconds
- [ ] Station data loads < 2 seconds
- [ ] Smooth animations (60fps)

#### Lighthouse Scores
Run: `npm run build && npm run preview`, then audit in Chrome DevTools

Target Scores:
- [ ] Performance: 90+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+
- [ ] PWA: ✓ (all checks pass)

#### Bundle Size
```bash
npm run build
```
- [ ] Main bundle < 500KB
- [ ] Vendor bundle < 1MB
- [ ] Total size < 2MB

### Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals/panels
- [ ] Focus indicators visible
- [ ] Focus order is logical
- [ ] No keyboard traps

#### Screen Reader
Test with NVDA (Windows) or VoiceOver (Mac):
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form inputs have labels
- [ ] Status messages announced
- [ ] Navigation landmarks present
- [ ] Heading hierarchy correct

#### Visual
- [ ] Text contrast ratio ≥ 4.5:1
- [ ] Focus indicators visible
- [ ] No color-only information
- [ ] Text resizable to 200%
- [ ] No horizontal scrolling at 320px width

#### Motion
- [ ] Animations can be disabled
- [ ] No flashing content
- [ ] Smooth scrolling optional

### Browser Compatibility

#### Desktop
- [ ] Chrome 90+ (Windows/Mac/Linux)
- [ ] Firefox 88+ (Windows/Mac/Linux)
- [ ] Safari 14+ (Mac)
- [ ] Edge 90+ (Windows)

#### Mobile
- [ ] Chrome Mobile (Android)
- [ ] Safari iOS 14+
- [ ] Samsung Internet
- [ ] Firefox Mobile

### Device Testing

#### Screen Sizes
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px+)
- [ ] Large Desktop (1920px+)

#### Orientations
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation handling

### Security Testing

#### HTTPS
- [ ] All resources load over HTTPS
- [ ] No mixed content warnings
- [ ] Service worker only on HTTPS

#### Data Privacy
- [ ] No sensitive data in localStorage
- [ ] Location data not transmitted unnecessarily
- [ ] API keys not exposed in client code
- [ ] No tracking without consent

### Edge Cases

#### Location
- [ ] Permission denied handling
- [ ] Location unavailable handling
- [ ] High accuracy vs battery trade-off
- [ ] Location timeout handling

#### Network
- [ ] Slow 3G performance
- [ ] Intermittent connectivity
- [ ] API timeout handling
- [ ] API error handling
- [ ] Rate limit handling

#### Data
- [ ] No stations found
- [ ] Empty search results
- [ ] Malformed API responses
- [ ] Large dataset (500+ stations)
- [ ] Duplicate station IDs

#### User Input
- [ ] Invalid search queries
- [ ] Special characters in search
- [ ] Very long station names
- [ ] Missing station data

## 🔧 Testing Tools

### Manual Testing
1. **Chrome DevTools**
   - Network throttling
   - Device emulation
   - Lighthouse audits
   - Application panel (PWA)

2. **Firefox Developer Tools**
   - Responsive design mode
   - Accessibility inspector

3. **Safari Web Inspector**
   - iOS device testing
   - Network conditions

### Automated Testing (Future)
```bash
# Unit tests
npm test

# E2E tests with Playwright
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

## 📝 Bug Report Template

When reporting issues, include:

```markdown
**Description**
Clear description of the issue

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Device: [e.g., iPhone 13]
- Screen Size: [e.g., 1920x1080]

**Console Errors**
Any errors from browser console
```

## ✅ Pre-Release Checklist

Before deploying to production:

- [ ] All critical tests pass
- [ ] Lighthouse scores meet targets
- [ ] Cross-browser testing complete
- [ ] Mobile device testing complete
- [ ] Accessibility audit passed
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Error handling tested
- [ ] Offline mode verified
- [ ] PWA installation tested
- [ ] Documentation updated
- [ ] API keys secured
- [ ] Analytics configured (if used)
- [ ] Monitoring set up
- [ ] Backup plan ready

## 🐛 Known Issues

Document any known issues here:

1. **Issue**: Heatmap performance with 500+ stations
   - **Workaround**: Limit visible stations or disable heatmap
   - **Status**: Investigating optimization

2. **Issue**: iOS Safari geolocation requires user gesture
   - **Workaround**: Button to request location
   - **Status**: Platform limitation

## 📊 Test Coverage Goals

- Unit Tests: 80%+
- Integration Tests: 60%+
- E2E Tests: Critical paths covered
- Accessibility: WCAG 2.1 AA compliant

---

**Remember**: Testing is an ongoing process. Test early, test often! 🧪
