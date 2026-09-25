export function runSafetyGate(payload) {
  const required = [
    ['foodType', payload.foodType],
    ['quantity', payload.quantity],
    ['storageState', payload.storageState],
    ['safeUntil', payload.safeUntil],
  ];

  const missing = required.filter(([, value]) => value === undefined || value === null || value === '').map(([key]) => key);
  const safeUntil = payload.safeUntil ? new Date(payload.safeUntil) : null;
  const reasons = [];

  if (missing.length) {
    return { status: 'rejected', reasons: missing.map((key) => `Missing required field: ${key}`) };
  }

  if (Number.isNaN(safeUntil?.getTime())) {
    return { status: 'rejected', reasons: ['safeUntil must be a valid date/time'] };
  }

  if (safeUntil.getTime() <= Date.now()) {
    return { status: 'rejected', reasons: ['safeUntil is already in the past'] };
  }

  const minutesLeft = Math.floor((safeUntil.getTime() - Date.now()) / 60000);
  if (minutesLeft < 30) {
    reasons.push(`Urgent: ${Math.max(0, minutesLeft)} minutes remain before the safe-until time`);
  }

  if (Number(payload.quantity) <= 0) {
    return { status: 'rejected', reasons: ['quantity must be greater than 0'] };
  }

  return { status: reasons.length ? 'urgent' : 'passed', reasons };
}
