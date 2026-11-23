import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from 'flowbite-react';
import type { TableColumn } from '@/types/common';
import type { PaginationMeta } from '@/types/api';
import { TableSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  keyExtractor: (item: T, index: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  meta,
  onPageChange,
  keyExtractor,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionLabel,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={meta?.per_page || 5} cols={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        onAction={onEmptyAction}
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            {columns.map((col) => (
              <TableHeadCell key={col.key} className={col.className}>
                {col.header}
              </TableHeadCell>
            ))}
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, idx) => (
              <TableRow
                key={keyExtractor(row, idx)}
                className="bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && meta.last_page > 1 && onPageChange && (
        <div className="flex flex-col items-center justify-between border-t border-gray-200 px-4 py-3 sm:flex-row dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{meta.from ?? 1}</span> to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{meta.to ?? data.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{meta.total}</span> entries
          </div>
          <div className="mt-2 sm:mt-0">
            <Pagination
              currentPage={meta.current_page}
              totalPages={meta.last_page}
              onPageChange={onPageChange}
              showIcons
            />
          </div>
        </div>
      )}
    </div>
  );
}
