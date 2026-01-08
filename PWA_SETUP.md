# PWA Setup Instructions

This app is now configured as a Progressive Web App (PWA) and can be installed on devices.

## Installation Steps

### 1. Install Required Package

First, install the PWA plugin:

```bash
npm install -D vite-plugin-pwa
```

### 2. Create App Icons

You need to create two icon files in the `public` folder:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can:
- Use an online icon generator (e.g., https://realfavicongenerator.net/)
- Create them from your logo/favicon
- Use a simple colored square with the hotel emoji 🏨

**Quick icon creation tip:**
- Use any image editor to create square PNG images
- Recommended: Use a hotel-related icon or the 🏨 emoji on a blue background (#1e3a8a)

### 3. Build the App

```bash
npm run build
```

### 4. Test Installation

1. Serve the built app:
   ```bash
   npm run preview
   ```

2. Open in a browser (Chrome/Edge recommended)

3. Look for the install prompt:
   - **Desktop**: Install icon in the address bar
   - **Mobile**: "Add to Home Screen" prompt

4. Or manually install:
   - **Chrome/Edge**: Click the install icon (⊕) in the address bar
   - **Mobile**: Menu → "Add to Home Screen" or "Install App"

## Features Enabled

✅ **Installable**: Can be installed on desktop and mobile devices
✅ **Offline Support**: Basic caching for offline functionality
✅ **App-like Experience**: Runs in standalone mode (no browser UI)
✅ **Auto-updates**: Service worker updates automatically

## Customization

### Change App Name
Edit `vite.config.ts` → `manifest.name` and `manifest.short_name`

### Change Theme Color
Edit `vite.config.ts` → `manifest.theme_color` (currently #1e3a8a - blue)

### Change Icons
Replace `public/icon-192.png` and `public/icon-512.png` with your own icons

## Troubleshooting

### Icons Not Showing
- Make sure icon files exist in the `public` folder
- Clear browser cache and rebuild

### Install Prompt Not Appearing
- Make sure you're using HTTPS (or localhost)
- Check browser console for errors
- Verify manifest.json is accessible

### Service Worker Not Registering
- Check browser console for errors
- Make sure you're running the built version (`npm run preview`)
- Clear browser cache and try again

## Testing Checklist

- [ ] Icons created and placed in `public` folder
- [ ] App builds successfully (`npm run build`)
- [ ] Install prompt appears in browser
- [ ] App installs successfully
- [ ] App opens in standalone mode (no browser UI)
- [ ] App works offline (basic functionality)

## Notes

- The service worker uses a basic caching strategy
- For production, you may want to customize the caching strategy
- Icons are required for the app to be installable
- The app works best on HTTPS (required for service workers in production)

