export function formatDistance(km) {
  if (km === null || km === undefined) return '—';
  return `${Number(km).toFixed(1)} km`;
}
