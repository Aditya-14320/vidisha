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
        className="flex flex-col items-center justify-center p-3.5 sm:p-4 bg-[#141417] rounded-2xl border border-[#26262e] shadow-md hover:border-gold-500/50 hover:shadow-[0_4px_20px_rgba(212,168,49,0.15)] transition-all duration-300 group text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#1c1c22] text-gold-400 flex items-center justify-center mb-2.5 group-hover:bg-gradient-to-tr group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-dark-950 transition-all duration-300 border border-[#2e2e38]">
          <DynamicIcon name={category.icon} className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
        </div>
        <span className="text-xs sm:text-sm font-medium text-[#d4d4d8] group-hover:text-gold-400 line-clamp-1">
          {category.name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className="flex items-start p-4.5 bg-[#141417] rounded-2xl border border-[#26262e] shadow-md hover:border-gold-500/50 hover:shadow-[0_6px_25px_rgba(212,168,49,0.15)] transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#1c1c22] text-gold-400 flex items-center justify-center shrink-0 mr-4 group-hover:bg-gradient-to-tr group-hover:from-gold-500 group-hover:to-gold-600 group-hover:text-dark-950 transition-all duration-300 border border-[#2e2e38]">
        <DynamicIcon name={category.icon} className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white group-hover:text-gold-400 truncate">
            {category.name}
          </h3>
          <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-gold-400 transform group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
        <p className="text-xs text-[#a1a1aa] line-clamp-2 mt-1 font-light leading-relaxed">
          {category.description}
        </p>
      </div>
    </Link>
  );
};
