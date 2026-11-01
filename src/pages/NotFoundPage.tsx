import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
        The page you are looking for in Vidisha City directory does not exist or has been shifted.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md"
      >
        Return to Home Directory
      </Link>
    </div>
  );
};
