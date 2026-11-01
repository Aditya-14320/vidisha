import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Grid, ArrowRight, X } from 'lucide-react';
import { Business, Category } from '../../types';
import { StorageService } from '../../services/storageService';

interface SearchBannerProps {
  categories: Category[];
}

export const SearchBanner: React.FC<SearchBannerProps> = ({ categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [suggestions, setSuggestions] = useState<Business[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Popular localities in Vidisha
  const vidishaLocalities = [
    'Station Road',
    'Durga Nagar',
    'Khariphatak',
    'Madhavganj',
    'Sherpura',
    'Tilak Chowk',
    'Bada Bazar',
    'Ahmedpur Road',
    'Civil Lines',
    'Venkatesh Market',
    'Neem Tal'
  ];

  useEffect(() => {
    StorageService.getBusinesses().then(setAllBusinesses).catch(console.warn);

    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length >= 2) {
      const q = val.toLowerCase().trim();
      const matches = allBusinesses
        .filter(b => b.approvalStatus === 'approved')
        .filter(b =>
          b.name.toLowerCase().includes(q) ||
          b.categoryName.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q) ||
          b.services?.some(s => s.toLowerCase().includes(q))
        )
        .slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedLocality) params.set('locality', selectedLocality);
    navigate(`/search?${params.toString()}`);
  };

  const selectSuggestion = (biz: Business) => {
    setShowSuggestions(false);
    navigate(`/business/${biz.slug}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl overflow-hidden mb-6 sm:mb-10">
      {/* Background architectural graphics */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-600/60 border border-blue-400/30 text-blue-100 text-[11px] sm:text-xs font-semibold mb-2 sm:mb-3">
          <MapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300" />
          <span>Vidisha City Local Directory & Deals</span>
        </div>
        <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3">
          Find the Best Businesses in <span className="text-amber-400">Vidisha</span>
        </h1>
        <p className="text-xs sm:text-base text-blue-100/90 max-w-xl mx-auto leading-relaxed">
          Discover verified shops, clinics, showrooms, restaurants, and professional services across Vidisha, Madhya Pradesh.
        </p>
      </div>

      {/* Main Search Bar Form */}
      <div ref={searchContainerRef} className="relative max-w-4xl mx-auto">
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white p-1.5 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-1.5 sm:gap-2 text-slate-800"
        >
          {/* Keyword Input */}
          <div className="flex items-center w-full md:w-2/5 px-2.5 sm:px-3 py-1 sm:py-1.5">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 shrink-0 mr-2 sm:mr-2.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
              placeholder="Search sweets, dentists, sarees, repair..."
              className="w-full text-xs sm:text-sm font-medium focus:outline-none placeholder-slate-400 bg-transparent text-slate-900"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setSuggestions([]); }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </button>
            )}
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Category Dropdown */}
          <div className="flex items-center w-full md:w-1/4 px-2.5 sm:px-3 py-1 sm:py-1.5 border-t md:border-t-0 border-slate-100">
            <Grid className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 shrink-0 mr-1.5 sm:mr-2" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium focus:outline-none bg-transparent text-slate-700 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-px h-8 bg-slate-200" />

          {/* Locality Dropdown */}
          <div className="flex items-center w-full md:w-1/4 px-2.5 sm:px-3 py-1 sm:py-1.5 border-t md:border-t-0 border-slate-100">
            <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-400 shrink-0 mr-1.5 sm:mr-2" />
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="w-full text-xs sm:text-sm font-medium focus:outline-none bg-transparent text-slate-700 cursor-pointer"
            >
              <option value="">All Localities</option>
              {vidishaLocalities.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 sm:space-x-2 shrink-0 transition-transform active:scale-95"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </form>

        {/* Real Autosuggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-left">
            <div className="p-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50 px-4">
              Matching Vidisha Businesses
            </div>
            {suggestions.map((biz) => (
              <button
                key={biz.id}
                type="button"
                onClick={() => selectSuggestion(biz)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 text-slate-800 transition-colors border-b border-slate-50 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                    {biz.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">{biz.name}</p>
                    <p className="text-xs text-slate-500">{biz.categoryName} • {biz.locality}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Search Tags */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-blue-100">
        <span className="font-semibold text-white">Popular:</span>
        {['Station Road', 'Sweets & Namkeen', 'Chanderi Sarees', 'Mobile Repair', 'Dentists'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag);
              const params = new URLSearchParams({ q: tag });
              navigate(`/search?${params.toString()}`);
            }}
            className="px-2.5 py-1 rounded-full bg-blue-800/80 hover:bg-blue-600 border border-blue-600/40 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};
