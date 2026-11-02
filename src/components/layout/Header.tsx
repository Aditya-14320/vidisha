import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Plus,
  MapPin,
  Sparkles,
  Grid,
  Tag
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-md border-b border-[#222225] transition-all">
      {/* Top Location Micro Bar as seen in screenshot */}
      <div className="bg-[#09090b] text-[#a3a3a3] text-xs py-2 px-4 border-b border-[#1c1c20]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-[#d4d4d8]">
            <MapPin className="w-3.5 h-3.5 text-gold-500 fill-gold-500/20" />
            <span className="font-medium tracking-wide text-[#e4e4e7]">Vidisha, Madhya Pradesh</span>
            <span className="text-[#71717a] font-normal">(Pin: 464001)</span>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-[11px] tracking-wide">
            <Link to="/advertise" className="text-gold-400 hover:text-gold-300 transition-colors font-medium flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Partner Placement</span>
            </Link>
            <span className="text-[#3f3f46]">•</span>
            <Link to="/listing-policy" className="hover:text-white transition-colors text-[#a1a1aa]">
              Directory Standards
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Row matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand matching screenshot gold diamond emblem & typography */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#1c1a14] to-[#0a0a0a] p-2 flex items-center justify-center border border-gold-500/40 shadow-[0_0_15px_rgba(212,168,49,0.15)] group-hover:border-gold-400 transition-all duration-300">
              <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Temple spire & diamond emblem */}
                <path d="M50 8L60 28H40L50 8Z" fill="#d4a831" />
                <path d="M50 24L75 48L50 92L25 48L50 24Z" stroke="#d4a831" strokeWidth="4" fill="#141416" />
                <path d="M50 36L66 52L50 82L34 52L50 36Z" fill="#d4a831" fillOpacity="0.85" />
                <circle cx="50" cy="52" r="5" fill="#0d0d0d" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Vidisha<span className="text-gold-500 font-serif italic ml-0.5">City</span>
                </span>
              </div>
              <p className="text-[10px] text-[#a1a1aa] tracking-wider uppercase font-medium">
                Explore • Connect • Grow
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'text-gold-400 bg-[#1c1c20] border border-gold-500/30 shadow-[0_0_12px_rgba(212,168,49,0.1)]'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/categories"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/categories')
                  ? 'text-gold-400 bg-[#1c1c20] border border-gold-500/30'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-gold-500" />
              <span>Categories</span>
            </Link>

            <Link
              to="/offers"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                isActive('/offers')
                  ? 'text-gold-400 bg-[#1c1c20] border border-gold-500/30'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-gold-500" />
              <span>Offers</span>
            </Link>

            <Link
              to="/pricing"
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 ${
                isActive('/pricing')
                  ? 'text-gold-400 bg-[#1c1c20] border border-gold-500/30'
                  : 'text-[#a1a1aa] hover:text-white hover:bg-[#18181c]'
              }`}
            >
              Placement Plans
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/list-your-business"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs lg:text-sm font-semibold text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-300 hover:to-gold-500 shadow-[0_0_20px_rgba(212,168,49,0.3)] transition-all duration-200 transform active:scale-95 group"
            >
              <Plus className="w-4 h-4 text-dark-950 stroke-[2.5]" />
              <span className="tracking-wide">List Business</span>
            </Link>
          </div>

          {/* Mobile Right Controls (+ button and 3-lines menu icon matching screenshot) */}
          <div className="flex md:hidden items-center space-x-2.5">
            <Link
              to="/list-your-business"
              className="w-10 h-10 rounded-full bg-[#1c1c20] border border-[#2e2e34] flex items-center justify-center text-white hover:border-gold-500 transition-colors"
              aria-label="List Business"
            >
              <Plus className="w-5 h-5 text-white stroke-[2.2]" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-[#1c1c20] border border-[#2e2e34] flex items-center justify-center text-white hover:border-gold-500 focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#222226] bg-[#111113]/98 backdrop-blur-2xl px-5 pt-4 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-sm font-medium ${
              isActive('/') ? 'bg-[#1c1c22] text-gold-400 border border-gold-500/30' : 'text-[#d4d4d8] hover:bg-[#18181c]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
              isActive('/categories') ? 'bg-[#1c1c22] text-gold-400 border border-gold-500/30' : 'text-[#d4d4d8] hover:bg-[#18181c]'
            }`}
          >
            <Grid className="w-4 h-4 text-gold-500" />
            <span>All Categories</span>
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
              isActive('/offers') ? 'bg-[#1c1c22] text-gold-400 border border-gold-500/30' : 'text-[#d4d4d8] hover:bg-[#18181c]'
            }`}
          >
            <Tag className="w-4 h-4 text-gold-500" />
            <span>Exclusive Deals & Offers</span>
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 rounded-xl text-sm font-medium ${
              isActive('/pricing') ? 'bg-[#1c1c22] text-gold-400 border border-gold-500/30' : 'text-[#d4d4d8] hover:bg-[#18181c]'
            }`}
          >
            Directory Placement Plans
          </Link>
          <Link
            to="/advertise"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl text-sm font-medium ${
              isActive('/advertise') ? 'bg-[#1c1c22] text-gold-400 border border-gold-500/30' : 'text-[#d4d4d8] hover:bg-[#18181c]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>Advertise with Us</span>
          </Link>

          <div className="pt-3 border-t border-[#222226]">
            <Link
              to="/list-your-business"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-full text-sm font-bold text-dark-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 shadow-[0_0_20px_rgba(212,168,49,0.3)]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>List Your Business Today</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
