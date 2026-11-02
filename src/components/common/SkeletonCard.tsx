import React from 'react';

export const BusinessCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#141417] rounded-3xl border border-[#26262e] overflow-hidden shadow-md">
      <div className="h-48 w-full skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 skeleton-shimmer rounded-full" />
          <div className="h-3 w-14 skeleton-shimmer rounded-full" />
        </div>
        <div className="h-5 w-3/4 skeleton-shimmer rounded-lg" />
        <div className="h-3 w-full skeleton-shimmer rounded" />
        <div className="h-3 w-2/3 skeleton-shimmer rounded" />
        <div className="pt-3 border-t border-[#222228] flex gap-2">
          <div className="h-9 flex-1 skeleton-shimmer rounded-full" />
          <div className="h-9 flex-1 skeleton-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-[#141417] rounded-2xl border border-[#26262e] flex items-center space-x-3 shadow-md">
      <div className="w-12 h-12 rounded-xl skeleton-shimmer shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 skeleton-shimmer rounded" />
        <div className="h-3 w-40 skeleton-shimmer rounded" />
      </div>
    </div>
  );
};
