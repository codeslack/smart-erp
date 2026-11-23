import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { salesService } from '../salesService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { SalesOrder } from '@/types/sales';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const SalesOrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await salesService.getSalesOrders({
        page,
        per_page: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrders(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage);
  };

  const handleConfirm = async (order: SalesOrder) => {
    try {
      await salesService.confirmSalesOrder(order.uuid);
      dispatch(
        addToast({
          title: 'Order Confirmed',
          message: `Sales order ${order.order_number} confirmed for fulfillment.`,
          type: 'success',
        })
      );
      fetchOrders(currentPage);
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

  const handleCancel = async (order: SalesOrder) => {
    try {
      await salesService.cancelSalesOrder(order.uuid);
      dispatch(
        addToast({
          title: 'Order Cancelled',
          message: `Sales order ${order.order_number} cancelled.`,
          type: 'warning',
        })
      );
      fetchOrders(currentPage);
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

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(term) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<SalesOrder>[] = [
    {
      key: 'order_number',
      header: 'Order #',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary-600" />
          <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
            {row.order_number}
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
            {row.customer?.name || '—'}
          </p>
          {row.customer?.code && (
            <p className="text-[10px] text-gray-500">{row.customer.code}</p>
          )}
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Dates',
      render: (row) => (
        <div className="text-xs">
          <p className="text-gray-900 dark:text-white">
            {row.order_date_formatted || row.order_date}
          </p>
          {row.expected_delivery_date_formatted && (
            <p className="text-gray-400">
              Delivery: {row.expected_delivery_date_formatted}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'grand_total',
      header: 'Order Value',
      render: (row) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(row.grand_total)}
        </span>
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
              title="Confirm Order"
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
              title="Cancel Order"
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
        title="Sales Orders"
        subtitle="Manage client confirmed orders, delivery commitments, and fulfillment schedules."
        actions={
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm" onClick={() => fetchOrders(currentPage)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <TextInput
            id="order-search"
            icon={Search}
            placeholder="Search by order number or customer name..."
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
            <option value="all">All Orders</option>
            <option value="draft">Draft</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Sales Orders"
          message={error}
          onRetry={() => fetchOrders(1)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredOrders}
          isLoading={isLoading}
          meta={meta}
          onPageChange={handlePageChange}
          keyExtractor={(o) => o.uuid}
          emptyTitle="No Sales Orders"
          emptyDescription="Orders converted from accepted quotations or created directly will appear here."
        />
      )}
    </div>
  );
};
