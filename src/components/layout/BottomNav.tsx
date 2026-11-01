import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Search, Tag, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive('/') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>

        <Link
          to="/categories"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive('/categories') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </Link>

        <Link
          to="/list-your-business"
          className="flex flex-col items-center -mt-4"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform active:scale-95 transition-transform border-2 border-white">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-blue-700 mt-0.5">List Biz</span>
        </Link>

        <Link
          to="/offers"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive('/offers') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-5 h-5 mb-0.5" />
          <span>Offers</span>
        </Link>

        <Link
          to="/search"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium transition-colors ${
            isActive('/search') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </Link>
      </div>
    </div>
  );
};
