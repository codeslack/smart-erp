import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { purchaseService } from '../purchaseService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { PurchaseReturn } from '@/types/purchase';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const PurchaseReturnList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await purchaseService.getPurchaseReturns({
        page,
        per_page: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setReturns(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchReturns(newPage);
  };

  const handleApprove = async (ret: PurchaseReturn) => {
    try {
      await purchaseService.approvePurchaseReturn(ret.uuid);
      dispatch(
        addToast({
          title: 'Return Approved',
          message: `Debit note ${ret.return_no} approved.`,
          type: 'success',
        })
      );
      fetchReturns(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Approval Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleConfirm = async (ret: PurchaseReturn) => {
    try {
      await purchaseService.confirmPurchaseReturn(ret.uuid);
      dispatch(
        addToast({
          title: 'Return Confirmed',
          message: `Debit note ${ret.return_no} confirmed and inventory credited.`,
          type: 'success',
        })
      );
      fetchReturns(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Confirmation Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleCancel = async (ret: PurchaseReturn) => {
    try {
      await purchaseService.cancelPurchaseReturn(ret.uuid);
      dispatch(
        addToast({
          title: 'Return Cancelled',
          message: `Debit note ${ret.return_no} cancelled.`,
          type: 'warning',
        })
      );
      fetchReturns(currentPage);
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

  const filteredReturns = returns.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.return_no.toLowerCase().includes(term) ||
      (r.supplier?.name && r.supplier.name.toLowerCase().includes(term)) ||
      (r.return_reason && r.return_reason.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge color="indigo">Approved</Badge>;
      case 'confirmed':
        return <Badge color="success">Confirmed</Badge>;
      case 'completed':
        return <Badge color="purple">Completed</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      default:
        return <Badge color="gray">Draft</Badge>;
    }
  };

  const columns: TableColumn<PurchaseReturn>[] = [
    {
      key: 'return_no',
      header: 'Debit Note #',
      render: (r: PurchaseReturn) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {r.return_no}
        </span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (r: PurchaseReturn) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {r.supplier?.name ?? '—'}
          </p>
          {r.supplier?.code && (
            <p className="text-xs text-gray-500">{r.supplier.code}</p>
          )}
        </div>
      ),
    },
    {
      key: 'return_date',
      header: 'Return Date',
      render: (r: PurchaseReturn) => r.return_date_formatted || r.return_date,
    },
    {
      key: 'grand_total',
      header: 'Total Value',
      className: 'text-right',
      render: (r: PurchaseReturn) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(r.grand_total)}
        </span>
      ),
    },
    {
      key: 'credited_amount',
      header: 'Credited / Refunded',
      className: 'text-right',
      render: (r: PurchaseReturn) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {formatCurrency(r.credited_amount || r.refund_amount || 0)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: PurchaseReturn) => getStatusBadge(r.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (r: PurchaseReturn) => (
        <div className="flex justify-end gap-2">
          {r.status === 'draft' && (
            <Button
              size="xs"
              color="indigo"
              onClick={() => handleApprove(r)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Approve
            </Button>
          )}
          {r.status === 'approved' && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleConfirm(r)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Confirm
            </Button>
          )}
          {r.status !== 'cancelled' && r.status !== 'completed' && (
            <Button
              size="xs"
              color="failure"
              onClick={() => handleCancel(r)}
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
        title="Purchase Returns & Debit Notes"
        subtitle="Manage returned vendor merchandise, credit notes, and inventory write-downs."
        breadcrumbs={[{ label: 'Purchasing' }, { label: 'Returns' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchReturns(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Purchase Returns"
          message={error}
          onRetry={() => fetchReturns(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search return # or suppliers..."
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
                <option value="approved">Approved</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <DataTable<PurchaseReturn>
            columns={columns}
            data={filteredReturns}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(r) => r.uuid}
            emptyTitle="No Purchase Returns Recorded"
            emptyDescription="Vendor debit notes and merchandise return items will appear here."
          />
        </div>
      )}
    </div>
  );
};
