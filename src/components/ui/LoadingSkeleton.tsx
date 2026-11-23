import React from 'react';

interface SkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton: React.FC<SkeletonProps> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full animate-pulse space-y-4">
      {/* Table Header */}
      <div className="flex h-10 w-full rounded bg-gray-200 dark:bg-gray-700" />
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center space-x-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="h-8 flex-1 rounded bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 p-6 shadow-xs dark:border-gray-700">
      <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-4 h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-4 h-3 w-1/4 rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
};

export const LoadingSkeleton: React.FC<{ variant?: 'card' | 'table'; count?: number }> = ({
  variant = 'card',
  count = 1,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) =>
        variant === 'table' ? (
          <TableSkeleton key={idx} />
        ) : (
          <CardSkeleton key={idx} />
        )
      )}
    </>
  );
};
