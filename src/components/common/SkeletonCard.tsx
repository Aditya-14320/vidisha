import React from 'react';

export const BusinessCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-0 shadow-sm">
      <div className="h-44 w-full skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 skeleton-shimmer rounded" />
          <div className="h-3 w-14 skeleton-shimmer rounded" />
        </div>
        <div className="h-5 w-3/4 skeleton-shimmer rounded" />
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="h-3 w-2/3 skeleton-shimmer rounded" />
        <div className="pt-2 border-t border-slate-100 flex gap-2">
          <div className="h-8 flex-1 skeleton-shimmer rounded-xl" />
          <div className="h-8 flex-1 skeleton-shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center space-x-3">
      <div className="w-12 h-12 rounded-xl skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 skeleton-shimmer rounded" />
        <div className="h-3 w-40 skeleton-shimmer rounded" />
      </div>
    </div>
  );
};
