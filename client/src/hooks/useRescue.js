import { useEffect, useState } from 'react';
import { getRescue } from '../services/rescueService';

export function useRescue(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getRescue(id).then(setData).finally(() => setLoading(false));
  }, [id]);

  return { data, loading, setData };
}
