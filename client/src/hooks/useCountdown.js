import { useEffect, useState } from 'react';
import { calculateCountdown } from '../utils/calculateCountdown';

export function useCountdown(initialMinutes = 45) {
  const [remaining, setRemaining] = useState(initialMinutes);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1 / 60)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return { minutes: Math.ceil(remaining), label: calculateCountdown(Math.ceil(remaining)) };
}
