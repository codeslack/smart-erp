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
import type { PurchaseOrder } from '@/types/purchase';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const PurchaseOrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
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
      const res = await purchaseService.getPurchaseOrders({
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

  const handleConfirm = async (order: PurchaseOrder) => {
    try {
      await purchaseService.confirmPurchaseOrder(order.uuid);
      dispatch(
        addToast({
          title: 'Order Confirmed',
          message: `Purchase order ${order.order_number} confirmed.`,
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

  const handleCancel = async (order: PurchaseOrder) => {
    try {
      await purchaseService.cancelPurchaseOrder(order.uuid);
      dispatch(
        addToast({
          title: 'Order Cancelled',
          message: `Purchase order ${order.order_number} cancelled.`,
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
      (o.supplier?.name && o.supplier.name.toLowerCase().includes(term))
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge color="success">Confirmed</Badge>;
      case 'received':
      case 'partially_received':
        return <Badge color="indigo">Received</Badge>;
      case 'billed':
      case 'completed':
        return <Badge color="purple">Completed</Badge>;
      case 'cancelled':
        return <Badge color="failure">Cancelled</Badge>;
      default:
        return <Badge color="gray">Draft</Badge>;
    }
  };

  const columns: TableColumn<PurchaseOrder>[] = [
    {
      key: 'order_number',
      header: 'Order #',
      render: (o: PurchaseOrder) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {o.order_number}
        </span>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      render: (o: PurchaseOrder) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {o.supplier?.name ?? '—'}
          </p>
          {o.supplier?.code && (
            <p className="text-xs text-gray-500">{o.supplier.code}</p>
          )}
        </div>
      ),
    },
    {
      key: 'order_date',
      header: 'Order Date',
      render: (o: PurchaseOrder) => o.order_date_formatted || o.order_date,
    },
    {
      key: 'expected_delivery_date',
      header: 'Delivery Due',
      render: (o: PurchaseOrder) => o.expected_delivery_date_formatted || o.expected_delivery_date || '—',
    },
    {
      key: 'grand_total',
      header: 'Total Amount',
      className: 'text-right',
      render: (o: PurchaseOrder) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {formatCurrency(o.amounts?.grand_total ?? 0)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (o: PurchaseOrder) => getStatusBadge(o.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (o: PurchaseOrder) => (
        <div className="flex justify-end gap-2">
          {o.status === 'draft' && (
            <Button
              size="xs"
              color="success"
              onClick={() => handleConfirm(o)}
              className="flex items-center gap-1"
            >
              <CheckCircle className="h-3 w-3" />
              Confirm
            </Button>
          )}
          {o.status !== 'cancelled' && o.status !== 'completed' && (
            <Button
              size="xs"
              color="failure"
              onClick={() => handleCancel(o)}
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
        title="Purchase Orders"
        subtitle="Manage supplier purchase orders, track expected deliveries, and process fulfillments."
        breadcrumbs={[{ label: 'Purchasing' }, { label: 'Purchase Orders' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchOrders(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Purchase Orders"
          message={error}
          onRetry={() => fetchOrders(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search orders or suppliers..."
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
                <option value="partially_received">Partially Received</option>
                <option value="received">Received</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <DataTable<PurchaseOrder>
            columns={columns}
            data={filteredOrders}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(o) => o.uuid}
            emptyTitle="No Purchase Orders Found"
            emptyDescription="Create purchase orders to procure stock from your registered vendors."
          />
        </div>
      )}
    </div>
  );
};
