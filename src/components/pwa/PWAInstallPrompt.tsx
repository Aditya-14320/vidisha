import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if app is already installed / standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return;
    }

    // Capture beforeinstallprompt for Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt banner after 3 seconds of browsing
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not standalone, show prompt after 5 seconds
    if (isIosDevice && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <>
      <div className="fixed bottom-16 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 animate-in slide-in-from-bottom-5 duration-300">
        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md p-1">
            <img src="/logo.svg" alt="Vidisha" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 pr-4">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              Install Vidisha City App
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Fast, offline-friendly access to all Vidisha shops, clinics, and daily offers right on your phone screen!
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-end space-x-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Maybe later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2">
              Install on iPhone / iPad
            </h3>

            <div className="space-y-3 text-left text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600">1.</span>
                <span className="flex-1 flex items-center gap-1">
                  Tap the Safari <Share2 className="w-4 h-4 text-blue-600 inline shrink-0" /> Share icon at the bottom of the screen.
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600">2.</span>
                <span className="flex-1 flex items-center gap-1">
                  Scroll down and choose <PlusSquare className="w-4 h-4 text-slate-700 inline shrink-0" /> "Add to Home Screen".
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="font-bold text-blue-600">3.</span>
                <span className="flex-1">
                  Tap "Add" in the top right corner. The Vidisha City app will appear on your home screen.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
