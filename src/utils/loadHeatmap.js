// Dynamically load leaflet.heat plugin
export async function loadHeatmapPlugin() {
  try {
    await import('leaflet.heat');
    return true;
  } catch (error) {
    console.warn('Leaflet.heat plugin could not be loaded:', error);
    return false;
  }
}
