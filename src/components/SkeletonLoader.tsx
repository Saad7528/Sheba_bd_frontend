import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-[450px] w-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-44 w-full bg-slate-200"></div>
      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-md w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 rounded w-12"></div>
            <div className="h-5 bg-slate-200 rounded w-20"></div>
          </div>
          <div className="h-9 bg-slate-200 rounded-xl w-28"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonCard;
