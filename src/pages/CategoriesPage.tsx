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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
          <Grid className="w-3.5 h-3.5" />
          <span>City Business Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Explore All 20 Categories
        </h1>
        <p className="text-sm text-slate-500">
          From famous Vidisha sweet makers to specialized healthcare clinics, explore the full spectrum of city services.
        </p>

        {/* Filter Input */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories (e.g. Sweets, Doctors, Mobiles)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus-ring bg-white"
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
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-600 font-medium">No matching categories found for "{search}".</p>
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
