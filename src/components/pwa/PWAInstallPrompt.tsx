import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare } from 'lucide-react';

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

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
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-white rounded-2xl shadow-[0_16px_50px_-8px_rgba(20,41,30,0.2)] border border-ivory-300 p-4 sm:p-5 animate-in slide-in-from-bottom-5 duration-300">
        <button
          onClick={() => setShowPrompt(false)}
          className="absolute top-3.5 right-3.5 p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-full hover:bg-ivory-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-forest-900 border border-gold-500/40 flex items-center justify-center shrink-0 shadow-md p-1.5">
            <img src="/logo.svg" alt="Vidisha" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 pr-5">
            <h4 className="font-serif text-sm font-bold text-forest-950 leading-snug">
              Install Vidisha City App
            </h4>
            <p className="text-xs text-charcoal-500 mt-0.5 leading-relaxed font-light">
              Offline-ready access to all Vidisha businesses, clinics, and daily offers — on your home screen.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2.5">
          <button
            onClick={() => setShowPrompt(false)}
            className="px-3.5 py-2 text-xs font-semibold text-charcoal-600 hover:bg-ivory-100 rounded-lg transition-colors border border-ivory-200"
          >
            Maybe later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 text-xs font-bold text-gold-300 bg-forest-900 hover:bg-forest-950 border border-gold-500/30 rounded-xl shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-center border border-ivory-300">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-700 rounded-full hover:bg-ivory-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-forest-900 border border-gold-500/40 flex items-center justify-center mx-auto mb-4 shadow-md">
              <Smartphone className="w-7 h-7 text-gold-300" />
            </div>

            <h3 className="font-serif text-base font-bold text-forest-950 mb-2">
              Install on iPhone / iPad
            </h3>

            <div className="space-y-3 text-left text-xs text-charcoal-600 mb-6 bg-ivory-100 p-4 rounded-2xl border border-ivory-300">
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-700 shrink-0">1.</span>
                <span className="flex-1 flex items-center gap-1 flex-wrap">
                  Tap the Safari <Share2 className="w-4 h-4 text-gold-600 inline shrink-0" /> Share icon at the bottom.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-700 shrink-0">2.</span>
                <span className="flex-1 flex items-center gap-1 flex-wrap">
                  Scroll down and choose <PlusSquare className="w-4 h-4 text-charcoal-700 inline shrink-0" /> "Add to Home Screen".
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-700 shrink-0">3.</span>
                <span className="flex-1">
                  Tap "Add" in the top right. Vidisha City will appear on your home screen.
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 bg-forest-900 hover:bg-forest-950 text-gold-300 rounded-xl font-semibold text-sm border border-gold-500/30 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
