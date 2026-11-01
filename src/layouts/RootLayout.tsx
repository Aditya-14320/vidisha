import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNav } from '../components/layout/BottomNav';
import { OfflineBanner } from '../components/pwa/OfflineBanner';
import { PWAInstallPrompt } from '../components/pwa/PWAInstallPrompt';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 w-full overflow-x-hidden">
      <OfflineBanner />
      <Header />
      <main className="flex-1 w-full pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <PWAInstallPrompt />
    </div>
  );
};
