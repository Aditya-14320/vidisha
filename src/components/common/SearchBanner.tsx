import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  X,
  LayoutGrid,
  ChevronDown
} from 'lucide-react';
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

  const [localitiesList, setLocalitiesList] = useState<string[]>([
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
  ]);

  useEffect(() => {
    StorageService.getBusinesses({ onlyApproved: true }).then(setAllBusinesses).catch(console.warn);
    StorageService.getLocalities().then(locs => {
      if (locs && locs.length > 0) {
        setLocalitiesList(locs.filter(l => l !== 'Other / Outskirts'));
      }
    }).catch(console.warn);

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

  const topSearches = [
    { label: 'Station Road', icon: '🏛️' },
    { label: 'Sweets & Namkeen', icon: '🎁' },
    { label: 'Chanderi Sarees', icon: '👗' },
    { label: 'Mobile Repair', icon: '📱' },
    { label: 'Dentists', icon: '🦷' }
  ];

  return (
    <div className="relative w-full overflow-hidden mb-8 sm:mb-12">
      {/* Hero Section Container matching reference screenshot */}
      <div className="relative min-h-[460px] sm:min-h-[520px] rounded-3xl overflow-hidden p-6 sm:p-10 md:p-12 border border-[#2a2416] shadow-2xl flex flex-col justify-between">
        
        {/* Background Image of Ancient Indian Carved Temple with warm sunset lighting */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&auto=format&fit=crop&q=85')`
          }}
        />

        {/* Cinematic dark luxury gradients matching screenshot (sky fade & bottom dark fade) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/85 via-[#0d0d0d]/60 to-[#0d0d0d] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/90 via-[#0d0d0d]/40 to-transparent pointer-events-none" />

        {/* Content Top: Typography matching screenshot */}
        <div className="relative z-10 max-w-2xl text-left pt-2 sm:pt-4">
          <h1 className="text-white font-serif italic text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide leading-snug drop-shadow-md">
            Discover Exceptional<br />
            Local Businesses in<span className="sr-only"> Vidisha, Madhya Pradesh</span>
          </h1>
          
          <div className="text-gold-400 font-script text-6xl sm:text-7xl md:text-8xl leading-none my-1 drop-shadow-[0_4px_20px_rgba(212,168,49,0.4)] select-none" aria-hidden="true">
            Vidisha
          </div>

          <p className="text-xs sm:text-sm text-[#e4e4e7] max-w-lg mt-3 leading-relaxed drop-shadow-sm font-normal">
            A meticulously curated index of verified jewelers, fine dining, healthcare practitioners, boutique retail, and trade services.
          </p>
        </div>

        {/* Content Bottom: Search Form & Filters */}
        <div ref={searchContainerRef} className="relative z-10 w-full max-w-2xl mt-8">
          <form
            onSubmit={handleSearchSubmit}
            className="space-y-3"
          >
            {/* Top rounded search bar with circular gold arrow button */}
            <div className="relative flex items-center bg-[#f5ede3] rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-white/20">
              <Search className="w-5 h-5 text-[#4a4a4a] ml-3.5 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
                placeholder="Search sweets, physicians, chanderi saree..."
                className="w-full text-xs sm:text-sm font-medium focus:outline-none placeholder-[#737373] bg-transparent text-[#18181b] px-3"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => { setQuery(''); setSuggestions([]); }}
                  className="p-1 text-[#525252] hover:text-[#18181b] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {/* Circular Gold Search/Arrow Button */}
              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-dark-950 flex items-center justify-center shrink-0 shadow-md transition-transform duration-200 active:scale-95"
              >
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Filter Row: Category & Locality rounded dropdown pills matching screenshot */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Category Pill */}
              <div className="relative flex items-center bg-[#1a1a1e]/90 backdrop-blur-md rounded-2xl sm:rounded-full px-3.5 py-2.5 border border-[#333338] shadow-md hover:border-gold-500/50 transition-colors">
                <LayoutGrid className="w-4 h-4 text-gold-400 shrink-0 mr-2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-white appearance-none cursor-pointer pr-4 truncate"
                >
                  <option value="" className="bg-[#18181c] text-white">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#18181c] text-white">
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa] absolute right-3 pointer-events-none" />
              </div>

              {/* Locality Pill */}
              <div className="relative flex items-center bg-[#1a1a1e]/90 backdrop-blur-md rounded-2xl sm:rounded-full px-3.5 py-2.5 border border-[#333338] shadow-md hover:border-gold-500/50 transition-colors">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mr-2" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full text-xs font-medium focus:outline-none bg-transparent text-white appearance-none cursor-pointer pr-4 truncate"
                >
                  <option value="" className="bg-[#18181c] text-white">All Localities</option>
                  {localitiesList.map((loc) => (
                    <option key={loc} value={loc} className="bg-[#18181c] text-white">
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#a1a1aa] absolute right-3 pointer-events-none" />
              </div>
            </div>

            {/* Explore Button: Full-width gold gradient pill matching reference screenshot */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#c9962a] via-[#d4a831] to-[#e6b84a] hover:from-[#d4a831] hover:to-[#f0c060] text-dark-950 font-bold text-sm shadow-[0_4px_20px_rgba(212,168,49,0.35)] flex items-center justify-center space-x-2 transition-transform duration-200 active:scale-98"
            >
              <span className="tracking-wide">Explore</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Autosuggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-14 left-0 right-0 bg-[#161619] rounded-2xl shadow-2xl border border-gold-500/30 overflow-hidden z-50 text-left">
              <div className="p-2.5 text-[10px] font-bold uppercase tracking-wider text-gold-400/90 border-b border-[#282830] bg-[#1a1a20] px-4 flex items-center justify-between">
                <span>Matching Verified Establishments</span>
                <span className="text-gold-300 font-semibold">{suggestions.length} Found</span>
              </div>
              {suggestions.map((biz) => (
                <button
                  key={biz.id}
                  type="button"
                  onClick={() => selectSuggestion(biz)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#202026] text-white transition-colors border-b border-[#222228] last:border-b-0 group"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#282830] text-gold-400 flex items-center justify-center text-xs font-bold border border-gold-500/20">
                      {biz.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white group-hover:text-gold-400 transition-colors line-clamp-1">{biz.name}</p>
                      <p className="text-xs text-[#a1a1aa]">{biz.categoryName} • <span className="text-gold-300 font-medium">{biz.locality}</span></p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#71717a] group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Searches Section matching screenshot below the hero */}
      <div className="mt-8 text-center">
        {/* Gold fire icon and title */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#161619] border border-[#2e2e36] text-white text-sm font-serif mb-4 shadow-sm">
          <span className="text-base">🔥</span>
          <span className="font-semibold tracking-wide">Top Searches</span>
        </div>

        {/* Search Pills matching screenshot */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
          {topSearches.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setQuery(item.label);
                const params = new URLSearchParams({ q: item.label });
                navigate(`/search?${params.toString()}`);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#18181c] hover:bg-[#222228] text-white border border-[#2e2e34] hover:border-gold-500/40 transition-all duration-200 text-xs font-medium shadow-sm active:scale-95"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
