import { Workbox } from 'workbox-window';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        if (confirm('New content available! Reload to update?')) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('Service worker waiting to activate');
    });

    wb.addEventListener('controlling', () => {
      console.log('Service worker is now controlling the page');
    });

    wb.register()
      .then(() => console.log('Service worker registered'))
      .catch((err) => console.error('Service worker registration failed:', err));
  }
}
