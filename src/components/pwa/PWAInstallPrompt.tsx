import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2, PlusSquare, Sparkles } from 'lucide-react';

interface PWAInstallPromptProps {
  inline?: boolean;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ inline = false }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // If iOS and not installed, iOS doesn't fire beforeinstallprompt, so support guide
    if (isIosDevice) {
      setIsInstallable(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) {
      // If browser doesn't support direct trigger or already handled
      alert('To install the app, tap your browser menu (⋮) and select "Add to Home screen" or "Install App".');
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Install prompt error', err);
    }
  };

  // If already installed, hide prompt
  if (isInstalled) return null;

  // On standard browsers before beforeinstallprompt fires, on mobile/desktop we can still show the card unless dismissed
  if (dismissed) return null;

  // Inline banner rendered in HomePage below hero/search
  if (inline) {
    return (
      <>
        <div className="relative overflow-hidden bg-gradient-to-r from-[#17171c] via-[#1c1c24] to-[#141418] rounded-3xl p-4 sm:p-6 border border-gold-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.7)] my-6 sm:my-8 group">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5 sm:space-x-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#0d0d0d] border border-gold-500/40 p-2 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(212,168,49,0.2)]">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 8L60 28H40L50 8Z" fill="#d4a831" />
                  <path d="M50 24L75 48L50 92L25 48L50 24Z" stroke="#d4a831" strokeWidth="4" fill="#141416" />
                  <path d="M50 36L66 52L50 82L34 52L50 36Z" fill="#d4a831" fillOpacity="0.85" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-gold-400 to-gold-500 px-2.5 py-0.5 rounded-full">
                    Official App
                  </span>
                  <span className="text-xs text-[#a1a1aa] hidden sm:inline">• Free & Fast</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-1 leading-snug">
                  Install Vidisha City App
                </h3>
                <p className="text-xs text-[#d4d4d8] line-clamp-1 font-light mt-0.5">
                  Instant offline access to verified shops, emergency doctors, and exclusive in-store deals.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 text-dark-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(212,168,49,0.35)] flex items-center space-x-2 transition-all duration-200 transform active:scale-95"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Install App</span>
              </button>
            </div>
          </div>
        </div>

        {/* iOS Instruction Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#141418] rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-center border border-gold-500/40 text-white">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full hover:bg-[#202028] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Smartphone className="w-7 h-7 stroke-[2.2]" />
              </div>

              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Install on iPhone / iPad
              </h3>

              <div className="space-y-3 text-left text-xs text-[#d4d4d8] mb-6 bg-[#1a1a22] p-4 rounded-2xl border border-[#2a2a36]">
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-gold-400 shrink-0">1.</span>
                  <span className="flex-1 flex items-center gap-1 flex-wrap">
                    Tap the Safari <Share2 className="w-4 h-4 text-gold-400 inline shrink-0" /> Share icon at the bottom of your screen.
                  </span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-gold-400 shrink-0">2.</span>
                  <span className="flex-1 flex items-center gap-1 flex-wrap">
                    Scroll down and tap <PlusSquare className="w-4 h-4 text-white inline shrink-0" /> "Add to Home Screen".
                  </span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="font-bold text-gold-400 shrink-0">3.</span>
                  <span className="flex-1">
                    Tap "Add" in the top right. Vidisha City will appear on your phone home screen!
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-3 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 rounded-full font-bold text-sm shadow-md transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Floating bottom drawer prompt (only when deferredPrompt is available or iOS)
  if (!isInstallable) return null;

  return (
    <>
      <div className="fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-40 bg-[#141418]/95 backdrop-blur-xl rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] border border-gold-500/40 p-4 sm:p-5 animate-in slide-in-from-bottom-5 duration-300 text-white">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3.5 right-3.5 p-1.5 text-[#a1a1aa] hover:text-white rounded-full hover:bg-[#22222a] transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0d0d0d] border border-gold-500/40 flex items-center justify-center shrink-0 shadow-md p-1.5">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 8L60 28H40L50 8Z" fill="#d4a831" />
              <path d="M50 24L75 48L50 92L25 48L50 24Z" stroke="#d4a831" strokeWidth="4" fill="#141416" />
              <path d="M50 36L66 52L50 82L34 52L50 36Z" fill="#d4a831" fillOpacity="0.85" />
            </svg>
          </div>
          <div className="flex-1 pr-5">
            <h4 className="font-serif text-sm font-bold text-white leading-snug">
              Install Vidisha City App
            </h4>
            <p className="text-xs text-[#a1a1aa] mt-0.5 leading-relaxed font-light">
              Fast, offline-ready access to all Vidisha businesses, clinics, and daily offers on your home screen.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end space-x-2.5">
          <button
            onClick={() => setDismissed(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#a1a1aa] hover:text-white rounded-full transition-colors border border-[#2a2a34] hover:bg-[#1f1f26]"
          >
            Maybe later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 text-xs font-bold text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 rounded-full shadow-md flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141418] rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl relative text-center border border-gold-500/40 text-white">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-[#a1a1aa] hover:text-white rounded-full hover:bg-[#202028] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-500 to-gold-600 text-dark-950 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Smartphone className="w-7 h-7 stroke-[2.2]" />
            </div>

            <h3 className="font-serif text-lg font-bold text-white mb-2">
              Install on iPhone / iPad
            </h3>

            <div className="space-y-3 text-left text-xs text-[#d4d4d8] mb-6 bg-[#1a1a22] p-4 rounded-2xl border border-[#2a2a36]">
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-400 shrink-0">1.</span>
                <span className="flex-1 flex items-center gap-1 flex-wrap">
                  Tap the Safari <Share2 className="w-4 h-4 text-gold-400 inline shrink-0" /> Share icon at the bottom of your screen.
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-400 shrink-0">2.</span>
                <span className="flex-1 flex items-center gap-1 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-4 h-4 text-white inline shrink-0" /> "Add to Home Screen".
                </span>
              </div>
              <div className="flex items-start space-x-2.5">
                <span className="font-bold text-gold-400 shrink-0">3.</span>
                <span className="flex-1">
                  Tap "Add" in the top right. Vidisha City will appear on your phone home screen!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 rounded-full font-bold text-sm shadow-md transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
