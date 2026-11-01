import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  PlusCircle,
  Tag,
  Grid,
  MapPin,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top micro bar for city context */}
      <div className="bg-blue-900 text-blue-100 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium">Vidisha, Madhya Pradesh (Pin: 464001)</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span>Verified Local Directory</span>
            <span>•</span>
            <Link to="/advertise" className="hover:text-white transition-colors font-semibold text-amber-300">
              Advertise
            </Link>
            <span>•</span>
            <Link to="/listing-policy" className="hover:text-white transition-colors">
              Directory Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <img src="/logo.svg" alt="Vidisha City" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Vidisha<span className="text-blue-600">City</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Verified Local Businesses & Deals
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/categories"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive('/categories')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4 text-blue-500" />
              <span>Categories</span>
            </Link>

            <Link
              to="/offers"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive('/offers')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Tag className="w-4 h-4 text-amber-500" />
              <span>City Offers</span>
            </Link>

            <Link
              to="/pricing"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/pricing')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Listing Packages
            </Link>

            <Link
              to="/advertise"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive('/advertise')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Advertise</span>
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/list-your-business"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Business</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/list-your-business"
              className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              aria-label="List Business"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/categories') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-5 h-5 text-blue-500" />
            <span>All Categories</span>
          </Link>
          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/offers') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-5 h-5 text-amber-500" />
            <span>Today's Offers & Deals</span>
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/pricing') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Listing Packages
          </Link>
          <Link
            to="/advertise"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/advertise') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Advertise on Vidisha City</span>
          </Link>

          <div className="pt-2">
            <Link
              to="/list-your-business"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md"
            >
              <PlusCircle className="w-5 h-5" />
              <span>List Your Business Today</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
