import React, { useState, useEffect } from 'react';
import { Search, Grid } from 'lucide-react';
import { Category } from '../types';
import { CategoryService } from '../services/categoryService';
import { CategoryCard } from '../components/common/CategoryCard';
import { CategoryCardSkeleton } from '../components/common/SkeletonCard';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CategoryService.getPublicCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1c1c22] text-gold-400 text-xs font-semibold border border-gold-500/30 mb-3">
          <Grid className="w-3.5 h-3.5 text-gold-400" />
          <span>Vidisha City Business Directory</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          Explore All Categories
        </h1>
        <p className="text-sm text-[#a1a1aa] font-light">
          From renowned sweet makers to specialized healthcare clinics, explore the full spectrum of Vidisha's commerce and services.
        </p>

        {/* Filter Input */}
        <div className="mt-7 max-w-md mx-auto relative">
          <Search className="w-5 h-5 text-[#71717a] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a category (e.g. Sweets, Doctors, Mobiles)..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-full border border-[#2e2e38] focus:outline-none focus:border-gold-500 bg-[#161619] text-white placeholder-[#71717a] shadow-md transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-[#141417] rounded-3xl border border-[#26262e] shadow-md">
          <p className="text-[#a1a1aa] font-medium font-serif text-lg mb-2">No categories match "{search}"</p>
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gold-400 font-bold hover:underline"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
};
