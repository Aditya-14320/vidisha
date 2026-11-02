import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center text-white pb-32">
      <div className="w-16 h-16 rounded-3xl bg-[#1c1c24] border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-5xl font-black text-white mb-2">404</h1>
      <h2 className="font-serif text-xl font-bold text-gold-400 mb-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-[#a1a1aa] mb-8 leading-relaxed font-light">
        The page you are looking for in Vidisha City directory does not exist or has been shifted.
      </p>
      <Link
        to="/"
        className="inline-block px-8 py-3 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 text-dark-950 font-bold text-sm rounded-full shadow-[0_0_20px_rgba(212,168,49,0.35)] transition-all active:scale-95"
      >
        Return to Home Directory
      </Link>
    </div>
  );
};
