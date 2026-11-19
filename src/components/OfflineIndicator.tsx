import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-4 left-4 right-4 sm:right-auto z-50 flex items-center gap-2 rounded-xl bg-[#0B2545] px-4 py-2.5 text-xs font-medium text-white shadow-lg border border-white/10"
    >
      <WifiOff className="w-4 h-4 text-[#D4A84F] shrink-0" />
      <span>Offline mode — displaying cached TrueCare data.</span>
    </div>
  );
};
