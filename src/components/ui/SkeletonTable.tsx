// src/components/ui/SkeletonTable.tsx

import React from "react";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ 
  rows = 5, 
  columns = 5 
}) => {
  return (
    <div className="w-full animate-pulse rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      {/* Table Header Section Skeleton */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 p-4 dark:border-gray-700 dark:bg-gray-700/50">
        <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Table Main Grid Area Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {Array.from({ length: columns }).map((_, idx) => (
                <th key={idx} className="px-6 py-3">
                  <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr 
                key={rIdx} 
                className="border-b bg-white last:border-none dark:border-gray-700 dark:bg-gray-800"
              >
                {Array.from({ length: columns }).map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    {/* Varied widths for text lines to mimic authentic database content values */}
                    <div 
                      className={`h-3 rounded bg-gray-200 dark:bg-gray-700`}
                      style={{ 
                        width: cIdx === 0 ? "40px" : cIdx === 1 ? "120px" : "70px" 
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer Skeleton */}
      <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
        <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex gap-2">
          <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
};
