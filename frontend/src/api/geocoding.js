import { GAZ } from '../constants/sites';

/**
 * Searches locations using OpenStreetMap Nominatim with a local gazetteer fallback.
 * @param {string} query
 * @returns {Promise<Array<{name: string, lat: number, lng: number}>>}
 */
export async function searchLocation(query) {
  const q = (query || "").trim();
  if (!q) return [];

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&limit=5`;
    const res = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!res.ok) throw new Error(`Geocoder failed with status ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 5).map(item => ({
        name: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
    }
  } catch (err) {
    console.warn("Nominatim geocoding failed, falling back to local gazetteer:", err);
  }

  // Fallback to local gazetteer
  const lower = q.toLowerCase();
  return GAZ.filter(g => g.name.toLowerCase().includes(lower)).slice(0, 5);
}

