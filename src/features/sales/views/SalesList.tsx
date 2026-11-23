import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, CheckCircle, XCircle, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { salesService } from '../salesService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { Sale } from '@/types/sales';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const SalesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [sales, setSales] = useState<Sale[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await salesService.getSales({
        page,
        per_page: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setSales(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchSales(newPage);
  };

  const handleConfirm = async (sale: Sale) => {
    try {
      await salesService.confirmSale(sale.uuid);
      dispatch(
        addToast({
          title: 'Invoice Confirmed',
          message: `Sale ${sale.sale_no} was successfully confirmed.`,
          type: 'success',
        })
      );
      fetchSales(currentPage);
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

  const handleCancel = async (sale: Sale) => {
    try {
      await salesService.cancelSale(sale.uuid);
      dispatch(
        addToast({
          title: 'Invoice Cancelled',
          message: `Sale ${sale.sale_no} was cancelled.`,
          type: 'warning',
        })
      );
      fetchSales(currentPage);
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

  const filteredSales = sales.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.sale_no.toLowerCase().includes(term) ||
      (s.customer?.name && s.customer.name.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<Sale>[] = [
    {
      key: 'sale_no',
      header: 'Invoice #',
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary-600" />
          <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
            {row.sale_no}
          </span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.customer?.name || 'Walk-in Customer'}
          </p>
          {row.customer?.code && (
            <p className="text-[10px] text-gray-500">{row.customer.code}</p>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Due',
      render: (row) => (
        <div className="text-xs">
          <p className="text-gray-900 dark:text-white">
            {row.sale_date_formatted || row.sale_date}
          </p>
          {row.due_date_formatted && (
            <p className="text-gray-400">Due: {row.due_date_formatted}</p>
          )}
        </div>
      ),
    },
    {
      key: 'financials',
      header: 'Grand Total',
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-gray-900 dark:text-white">
            {formatCurrency(row.grand_total)}
          </p>
          {row.due_amount > 0 ? (
            <p className="text-red-500 font-medium">Due: {formatCurrency(row.due_amount)}</p>
          ) : (
            <p className="text-emerald-500">Fully Paid</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const color =
          row.status === 'confirmed' || row.status === 'completed'
            ? 'success'
            : row.status === 'cancelled'
            ? 'failure'
            : 'warning';
        return <Badge color={color}>{row.status_label || row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1.5">
          {row.status === 'draft' && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleConfirm(row)}
              title="Confirm Sale"
            >
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Confirm
            </Button>
          )}
          {row.status !== 'cancelled' && (
            <Button
              size="xs"
              color="gray"
              onClick={() => handleCancel(row)}
              title="Cancel Sale"
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Invoices"
        subtitle="Customer sales billing, payment receipts, order conversions, and ledger postings."
        actions={
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm" onClick={() => fetchSales(currentPage)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <TextInput
            id="sale-search"
            icon={Search}
            placeholder="Search by invoice number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Invoices</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Sales Invoices"
          message={error}
          onRetry={() => fetchSales(1)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSales}
          isLoading={isLoading}
          meta={meta}
          onPageChange={handlePageChange}
          keyExtractor={(s) => s.uuid}
          emptyTitle="No Sales Invoices Recorded"
          emptyDescription="Convert an accepted quotation or sales order to generate your first invoice."
        />
      )}
    </div>
  );
};
