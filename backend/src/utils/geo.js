const EARTH_RADIUS_KM = 6371;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function haversineKm(a, b) {
  if (!a?.lat || !a?.lng || !b?.lat || !b?.lng) return null;

  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return Number((2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))).toFixed(2));
}

export function estimateMinutes(distanceKm, averageSpeedKmh = 22) {
  if (distanceKm == null) return null;
  return Math.max(5, Math.ceil((distanceKm / averageSpeedKmh) * 60));
}
