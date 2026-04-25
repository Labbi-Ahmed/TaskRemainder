import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
};

export const TaskSkeleton: React.FC = () => {
  return (
    <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 last:border-0">
      <div className="flex items-center w-full">
        <Skeleton className="w-2 h-2 rounded-full mr-4" />
        <div className="w-full max-w-[200px]">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex items-center space-x-3 ml-4">
        <Skeleton className="w-16 h-4 rounded-full" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};
