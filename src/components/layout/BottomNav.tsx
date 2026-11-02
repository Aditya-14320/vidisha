import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Search, Tag, FilePlus } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111114]/95 backdrop-blur-2xl border-t border-[#24242c] px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
            isActive('/') ? 'text-gold-400 font-bold' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 mb-0.5 ${isActive('/') ? 'text-gold-400 stroke-[2.5]' : 'text-[#8e8e93]'}`} />
            {isActive('/') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-gold-400 rounded-full" />
            )}
          </div>
          <span className="mt-0.5">Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/categories"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
            isActive('/categories') ? 'text-gold-400 font-bold' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <LayoutGrid className={`w-5 h-5 mb-0.5 ${isActive('/categories') ? 'text-gold-400 stroke-[2.5]' : 'text-[#8e8e93]'}`} />
          <span className="mt-0.5">Categories</span>
        </Link>

        {/* Center Floating Gold Action Button matching screenshot */}
        <Link
          to="/list-your-business"
          className="flex flex-col items-center -mt-6 group"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 p-3 rounded-full bg-gradient-to-tr from-[#c9962a] via-[#e2b845] to-[#f5d070] text-dark-950 flex items-center justify-center shadow-[0_6px_25px_rgba(212,168,49,0.5)] transform active:scale-95 group-hover:scale-105 transition-all border-2 border-[#161619]">
            <FilePlus className="w-6 h-6 text-dark-950 stroke-[2.3]" />
          </div>
          <span className="text-[10px] font-bold text-white mt-1 tracking-tight">List Biz</span>
        </Link>

        {/* Offers */}
        <Link
          to="/offers"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
            isActive('/offers') ? 'text-gold-400 font-bold' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Tag className={`w-5 h-5 mb-0.5 ${isActive('/offers') ? 'text-gold-400 stroke-[2.5]' : 'text-[#8e8e93]'}`} />
          <span className="mt-0.5">Offers</span>
        </Link>

        {/* Search */}
        <Link
          to="/search"
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-medium transition-all ${
            isActive('/search') ? 'text-gold-400 font-bold' : 'text-[#8e8e93] hover:text-white'
          }`}
        >
          <Search className={`w-5 h-5 mb-0.5 ${isActive('/search') ? 'text-gold-400 stroke-[2.5]' : 'text-[#8e8e93]'}`} />
          <span className="mt-0.5">Search</span>
        </Link>
      </div>
    </div>
  );
};
