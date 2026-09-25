import { useEffect, useState } from 'react';
import { getDriverDashboard } from '../services/driverService';

export function useDriver() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDriverDashboard().then(setData).finally(() => setLoading(false));
  }, []);

  return { data, loading, setData };
}
