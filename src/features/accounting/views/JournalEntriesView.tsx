import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { accountingService } from '../accountingService';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { JournalEntry } from '@/types/accounting';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const JournalEntriesView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await accountingService.getJournalEntries({
        page,
        per_page: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setEntries(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchEntries(newPage);
  };

  const handlePost = async (entry: JournalEntry) => {
    try {
      await accountingService.postJournalEntry(entry.uuid);
      dispatch(
        addToast({
          title: 'Voucher Posted',
          message: `Journal voucher ${entry.voucher_no} successfully posted to the general ledger.`,
          type: 'success',
        })
      );
      fetchEntries(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Posting Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleCancel = async (entry: JournalEntry) => {
    try {
      await accountingService.cancelJournalEntry(entry.uuid);
      dispatch(
        addToast({
          title: 'Voucher Cancelled',
          message: `Journal voucher ${entry.voucher_no} was cancelled.`,
          type: 'warning',
        })
      );
      fetchEntries(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Cancellation Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const filteredEntries = entries.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.voucher_no.toLowerCase().includes(term) ||
      (e.description && e.description.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return <Badge color="success">Posted</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      default:
        return <Badge color="gray">Draft</Badge>;
    }
  };

  const columns: TableColumn<JournalEntry>[] = [
    {
      key: 'voucher_no',
      header: 'Voucher #',
      render: (e: JournalEntry) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {e.voucher_no}
        </span>
      ),
    },
    {
      key: 'transaction_date',
      header: 'Txn Date',
      render: (e: JournalEntry) => e.transaction_date_formatted || e.transaction_date,
    },
    {
      key: 'voucher_type',
      header: 'Type',
      render: (e: JournalEntry) => (
        <Badge color="light">{e.voucher_type || 'General'}</Badge>
      ),
    },
    {
      key: 'description',
      header: 'Description / Narration',
      render: (e: JournalEntry) => (
        <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs block">
          {e.description || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (e: JournalEntry) => getStatusBadge(e.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (e: JournalEntry) => (
        <div className="flex justify-end gap-2">
          {e.status === 'draft' && (
            <Button
              size="xs"
              color="success"
              onClick={() => handlePost(e)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Post
            </Button>
          )}
          {e.status !== 'cancelled' && (
            <Button
              size="xs"
              color="failure"
              onClick={() => handleCancel(e)}
              className="flex items-center gap-1"
            >
              <XCircle className="h-3 w-3" />
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Journal Entries"
        subtitle="Manage financial vouchers, adjustments, and general ledger double-entry transactions."
        breadcrumbs={[{ label: 'Accounting' }, { label: 'Journal Entries' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchEntries(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Journal Entries"
          message={error}
          onRetry={() => fetchEntries(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search voucher # or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-44"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="posted">Posted</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <DataTable<JournalEntry>
            columns={columns}
            data={filteredEntries}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(e) => e.uuid}
            emptyTitle="No Journal Entries Found"
            emptyDescription="All manual and system-generated accounting journal vouchers appear here."
          />
        </div>
      )}
    </div>
  );
};
