import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/layout/BottomNav';
import { OfflineBanner } from '../components/pwa/OfflineBanner';
import { PWAInstallPrompt } from '../components/pwa/PWAInstallPrompt';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white w-full overflow-x-hidden selection:bg-gold-500 selection:text-dark-950">
      <OfflineBanner />
      <Header />
      <main className="flex-1 w-full pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
};
