export function statusTone(status) {
  const tones = {
    Posted: 'neutral',
    'Safety Checked': 'success',
    'Recipient Confirmed': 'success',
    Secured: 'success',
    'Picked Up': 'warning',
    Delivered: 'success',
    'Re-routing': 'warning',
    Failed: 'danger',
    Expired: 'danger',
  };
  return tones[status] || 'neutral';
}
