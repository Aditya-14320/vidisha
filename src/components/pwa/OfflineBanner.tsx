import React, { useState, useEffect } from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span className="font-semibold">
            You are currently browsing offline.
          </span>
          <span className="hidden sm:inline opacity-90">
            Cached listings are accessible, but active searches and fresh offers require internet connectivity.
          </span>
        </div>
        <span className="text-[11px] font-bold bg-amber-700 px-2 py-0.5 rounded">
          Offline Mode
        </span>
      </div>
    </div>
  );
};
