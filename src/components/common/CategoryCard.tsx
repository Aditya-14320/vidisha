import React from 'react';
import { Link } from 'react-router-dom';
import { DynamicIcon } from './DynamicIcon';
import { Category } from '../../types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  compact?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, compact = false }) => {
  if (compact) {
    return (
      <Link
        to={`/category/${category.slug}`}
        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all group text-center"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <DynamicIcon name={category.icon} className="w-6 h-6" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1">
          {category.name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="flex items-start p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <DynamicIcon name={category.icon} className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 truncate">
            {category.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
          {category.description}
        </p>
      </div>
    </Link>
  );
};
