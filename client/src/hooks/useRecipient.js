import { useCallback, useEffect, useState } from 'react';
import { getRecipientDashboard } from '../services/recipientService';

export function useRecipient() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await getRecipientDashboard();
      setData(next);
      return next;
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getRecipientDashboard()
      .then((next) => {
        if (active) {
          setData(next);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError?.response?.data?.message || 'Unable to load your recipient dashboard.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { data, error, loading, refreshing, refresh };
}
