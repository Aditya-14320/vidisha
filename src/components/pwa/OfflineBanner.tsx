import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

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
    <div className="bg-charcoal-900 text-ivory-100 text-xs py-2 px-4 sticky top-0 z-50 border-b border-gold-500/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <WifiOff className="w-4 h-4 shrink-0 text-gold-400" />
          <span className="font-medium">
            You are browsing offline.
          </span>
          <span className="hidden sm:inline text-ivory-300/70 font-light">
            Cached listings are accessible, but fresh searches require connectivity.
          </span>
        </div>
        <span className="text-[11px] font-bold bg-forest-900/80 text-gold-300 px-2.5 py-0.5 rounded-full border border-gold-500/20">
          Offline Mode
        </span>
      </div>
    </div>
  );
};
