import { useEffect, useState } from 'react';
import { getMyDonations } from '../services/donationService';

export function useDonations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyDonations().then(setData).catch(() => setError('Unable to load donations.')).finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
