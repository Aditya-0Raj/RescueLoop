import { createContext, useContext, useMemo, useState } from 'react';

const RescueContext = createContext(null);

export function RescueProvider({ children }) {
  const [activeRescueId, setActiveRescueId] = useState('RL-1024');
  const [statusOverride, setStatusOverride] = useState(null);

  const value = useMemo(
    () => ({ activeRescueId, setActiveRescueId, statusOverride, setStatusOverride }),
    [activeRescueId, statusOverride],
  );

  return <RescueContext.Provider value={value}>{children}</RescueContext.Provider>;
}

export function useRescueContext() {
  const value = useContext(RescueContext);
  if (!value) throw new Error('useRescueContext must be used inside RescueProvider');
  return value;
}
