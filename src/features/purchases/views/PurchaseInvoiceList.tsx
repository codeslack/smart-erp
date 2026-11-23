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
import type { PurchaseInvoice } from '@/types/purchase';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const PurchaseInvoiceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await purchaseService.getPurchases({
        page,
        per_page: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setPurchases(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchPurchases(newPage);
  };

  const handleConfirm = async (purchase: PurchaseInvoice) => {
    try {
      await purchaseService.confirmPurchase(purchase.uuid);
      dispatch(
        addToast({
          title: 'Bill Confirmed',
          message: `Purchase invoice ${purchase.purchase_no} confirmed into accounting ledger.`,
          type: 'success',
        })
      );
      fetchPurchases(currentPage);
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

  const handleCancel = async (purchase: PurchaseInvoice) => {
    try {
      await purchaseService.cancelPurchase(purchase.uuid);
      dispatch(
        addToast({
          title: 'Bill Cancelled',
          message: `Purchase invoice ${purchase.purchase_no} cancelled.`,
          type: 'warning',
        })
      );
      fetchPurchases(currentPage);
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

  const filteredPurchases = purchases.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.purchase_no.toLowerCase().includes(term) ||
      (p.supplier_invoice_number && p.supplier_invoice_number.toLowerCase().includes(term)) ||
      (p.supplier?.name && p.supplier.name.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge color="indigo">Confirmed</Badge>;
      case 'paid':
        return <Badge color="success">Paid</Badge>;
      case 'partially_paid':
        return <Badge color="warning">Partially Paid</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      default:
        return <Badge color="gray">Draft</Badge>;
    }
  };

  const columns: TableColumn<PurchaseInvoice>[] = [
    {
      key: 'purchase_no',
      header: 'Bill #',
      render: (p: PurchaseInvoice) => (
        <div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {p.purchase_no}
          </span>
          {p.supplier_invoice_number && (
            <p className="text-xs text-gray-500">
              Supplier Ref: {p.supplier_invoice_number}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (p: PurchaseInvoice) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {p.supplier?.name ?? '—'}
          </p>
          {p.supplier?.code && (
            <p className="text-xs text-gray-500">{p.supplier.code}</p>
          )}
        </div>
      ),
    },
    {
      key: 'purchase_date',
      header: 'Bill Date',
      render: (p: PurchaseInvoice) => p.purchase_date_formatted || p.purchase_date,
    },
    {
      key: 'due_date',
      header: 'Due Date',
      render: (p: PurchaseInvoice) => p.due_date_formatted || p.due_date || '—',
    },
    {
      key: 'grand_total',
      header: 'Total Bill',
      className: 'text-right',
      render: (p: PurchaseInvoice) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(p.grand_total)}
        </span>
      ),
    },
    {
      key: 'due_amount',
      header: 'Balance Due',
      className: 'text-right',
      render: (p: PurchaseInvoice) => (
        <span
          className={`font-medium ${
            p.due_amount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
          }`}
        >
          {formatCurrency(p.due_amount)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: PurchaseInvoice) => getStatusBadge(p.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (p: PurchaseInvoice) => (
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
          {p.status !== 'cancelled' && p.status !== 'paid' && (
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
        title="Purchase Bills & Invoices"
        subtitle="Manage supplier bills, payable balances, and general ledger journal postings."
        breadcrumbs={[{ label: 'Purchasing' }, { label: 'Bills' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchPurchases(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Purchase Bills"
          message={error}
          onRetry={() => fetchPurchases(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search bills, refs, or suppliers..."
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
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <DataTable<PurchaseInvoice>
            columns={columns}
            data={filteredPurchases}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(p) => p.uuid}
            emptyTitle="No Purchase Bills Found"
            emptyDescription="Vendor invoices and procurement bills will appear here once entered."
          />
        </div>
      )}
    </div>
  );
};
