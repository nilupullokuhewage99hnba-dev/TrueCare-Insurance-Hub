import React, { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {variant === 'card' ? (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-[#0B2545] hover:bg-slate-50 active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isIOS ? <Share className="w-4 h-4 text-[#B4832D]" /> : <Download className="w-4 h-4 text-[#B4832D]" />}
          <span>{isInstallable ? 'Install TrueCare App' : 'Save to Home Screen'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-[#0B2545] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#B4832D]" />
          <span>Install App</span>
        </button>
      )}

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="pwa-guide-title" className="text-base font-semibold text-[#0F172A]">
                  {isIOS ? 'Install on iPhone or iPad' : 'Add TrueCare to Home Screen'}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Quick one-tap access to Nilupul’s contact, plans, and rewards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install guide"
                className="min-h-[40px] min-w-[40px] -mr-2 -mt-2 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-4 space-y-2.5 text-sm text-slate-700">
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">01.</span>
                  <span>Tap the <strong>Share</strong> icon in the Safari toolbar.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">02.</span>
                  <span>Scroll down and select <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">03.</span>
                  <span>Tap <strong>Add</strong> to save TrueCare alongside your apps.</span>
                </li>
              </ol>
            ) : (
              <ol className="mt-4 space-y-2.5 text-sm text-slate-700">
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">01.</span>
                  <span>Open your browser menu (three dots in Chrome or Edge).</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">02.</span>
                  <span>Choose <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="font-mono-tabular text-xs font-semibold text-[#B4832D] pt-0.5">03.</span>
                  <span>Confirm to launch TrueCare in full-screen standalone mode.</span>
                </li>
              </ol>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-xl bg-[#0B2545] text-sm font-medium text-white hover:bg-[#133863] transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
