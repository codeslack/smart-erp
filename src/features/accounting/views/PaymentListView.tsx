import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { accountingService } from '../accountingService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { PaymentRecord } from '@/types/accounting';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const PaymentListView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await accountingService.getPayments({
        page,
        per_page: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setPayments(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchPayments(newPage);
  };

  const handleConfirm = async (payment: PaymentRecord) => {
    try {
      await accountingService.confirmPayment(payment.uuid);
      dispatch(
        addToast({
          title: 'Payment Confirmed',
          message: `Payment ${payment.payment_no} confirmed and reconciled.`,
          type: 'success',
        })
      );
      fetchPayments(currentPage);
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

  const handleCancel = async (payment: PaymentRecord) => {
    try {
      await accountingService.cancelPayment(payment.uuid);
      dispatch(
        addToast({
          title: 'Payment Cancelled',
          message: `Payment ${payment.payment_no} cancelled.`,
          type: 'warning',
        })
      );
      fetchPayments(currentPage);
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

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.payment_no.toLowerCase().includes(term) ||
      (p.reference_no && p.reference_no.toLowerCase().includes(term)) ||
      (p.notes && p.notes.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge color="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      case 'reversed':
        return <Badge color="purple">Reversed</Badge>;
      default:
        return <Badge color="gray">Draft</Badge>;
    }
  };

  const columns: TableColumn<PaymentRecord>[] = [
    {
      key: 'payment_no',
      header: 'Payment #',
      render: (p: PaymentRecord) => (
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {p.payment_no}
          </span>
          {p.reference_no && (
            <p className="text-xs text-gray-500">Ref: {p.reference_no}</p>
          )}
        </div>
      ),
    },
    {
      key: 'payment_type',
      header: 'Type',
      render: (p: PaymentRecord) => (
        <Badge color={p.payment_type === 'receive' ? 'success' : 'warning'}>
          {p.payment_type === 'receive' ? 'Receipt (Inflow)' : 'Disbursement (Outflow)'}
        </Badge>
      ),
    },
    {
      key: 'payment_date',
      header: 'Date',
      render: (p: PaymentRecord) => p.payment_date_formatted || p.payment_date,
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: (p: PaymentRecord) => (
        <span className="capitalize text-gray-700 dark:text-gray-300">
          {p.payment_method?.replace(/_/g, ' ') || 'Cash'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right',
      render: (p: PaymentRecord) => (
        <span
          className={`font-semibold ${
            p.payment_type === 'receive'
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {formatCurrency(p.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: PaymentRecord) => getStatusBadge(p.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p: PaymentRecord) => (
        <div className="flex justify-end gap-2">
          {p.status === 'draft' && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleConfirm(p)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Confirm
            </Button>
          )}
          {p.status !== 'cancelled' && p.status !== 'reversed' && (
            <Button
              size="xs"
              color="failure"
              onClick={() => handleCancel(p)}
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
        title="Payments & Receipts"
        subtitle="Manage customer collections, vendor payments, and bank disbursement records."
        breadcrumbs={[{ label: 'Accounting' }, { label: 'Payments' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchPayments(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Payments"
          message={error}
          onRetry={() => fetchPayments(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search payment # or reference..."
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
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <DataTable<PaymentRecord>
            columns={columns}
            data={filteredPayments}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(p) => p.uuid}
            emptyTitle="No Payments Recorded"
            emptyDescription="Inflows from customer invoices and outflows to supplier bills will be logged here."
          />
        </div>
      )}
    </div>
  );
};
