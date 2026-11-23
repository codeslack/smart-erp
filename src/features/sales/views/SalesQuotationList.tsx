import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, Send, CheckCircle, XCircle, ArrowRightCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { salesService } from '../salesService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { SalesQuotation } from '@/types/sales';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const SalesQuotationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [quotations, setQuotations] = useState<SalesQuotation[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotations = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await salesService.getSalesQuotations({
        page,
        per_page: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setQuotations(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    fetchQuotations(newPage);
  };

  const handleSend = async (quotation: SalesQuotation) => {
    try {
      await salesService.sendQuotation(quotation.uuid);
      dispatch(
        addToast({
          title: 'Quotation Sent',
          message: `Quotation ${quotation.quotation_no} marked as Sent to client.`,
          type: 'success',
        })
      );
      fetchQuotations(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Failed to Send',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleAccept = async (quotation: SalesQuotation) => {
    try {
      await salesService.acceptQuotation(quotation.uuid);
      dispatch(
        addToast({
          title: 'Quotation Accepted',
          message: `Quotation ${quotation.quotation_no} marked as Accepted.`,
          type: 'success',
        })
      );
      fetchQuotations(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Acceptance Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleReject = async (quotation: SalesQuotation) => {
    try {
      await salesService.rejectQuotation(quotation.uuid);
      dispatch(
        addToast({
          title: 'Quotation Rejected',
          message: `Quotation ${quotation.quotation_no} marked as Rejected.`,
          type: 'warning',
        })
      );
      fetchQuotations(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Rejection Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const handleConvertToOrder = async (quotation: SalesQuotation) => {
    try {
      await salesService.convertQuotationToOrder(quotation.uuid);
      dispatch(
        addToast({
          title: 'Converted to Order',
          message: `Quotation ${quotation.quotation_no} was successfully converted to a Sales Order.`,
          type: 'success',
        })
      );
      fetchQuotations(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Conversion Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      q.quotation_no.toLowerCase().includes(term) ||
      (q.customer?.name && q.customer.name.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<SalesQuotation>[] = [
    {
      key: 'quotation_no',
      header: 'Quotation #',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
          {row.quotation_no}
        </span>
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
            {row.quotation_date_formatted || row.quotation_date}
          </p>
          {row.expiry_date_formatted && (
            <p className="text-gray-400">Expires: {row.expiry_date_formatted}</p>
          )}
        </div>
      ),
    },
    {
      key: 'grand_total',
      header: 'Estimate Value',
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
          row.status === 'accepted' || row.status === 'converted_to_order'
            ? 'success'
            : row.status === 'rejected' || row.status === 'cancelled'
            ? 'failure'
            : row.status === 'sent'
            ? 'info'
            : 'warning';
        return <Badge color={color}>{row.status_label || row.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Workflow Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1.5">
          {row.status === 'draft' && (
            <Button
              size="xs"
              color="gray"
              onClick={() => handleSend(row)}
              title="Mark as Sent to Client"
            >
              <Send className="mr-1 h-3.5 w-3.5" />
              Send
            </Button>
          )}
          {(row.status === 'draft' || row.status === 'sent') && (
            <>
              <Button
                size="xs"
                color="success"
                onClick={() => handleAccept(row)}
                title="Client Accepted"
              >
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                Accept
              </Button>
              <Button
                size="xs"
                color="failure"
                onClick={() => handleReject(row)}
                title="Client Rejected"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          {row.status === 'accepted' && (
            <Button
              size="xs"
              color="primary"
              onClick={() => handleConvertToOrder(row)}
              title="Convert Accepted Quotation to Sales Order"
            >
              <ArrowRightCircle className="mr-1 h-3.5 w-3.5" />
              To Order
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Quotations"
        subtitle="Manage price estimates, customer proposals, acceptance workflows, and order conversion."
        actions={
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm" onClick={() => fetchQuotations(currentPage)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <TextInput
            id="quotation-search"
            icon={Search}
            placeholder="Search by quotation number or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44"
          >
            <option value="all">All Quotations</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="converted_to_order">Converted to Order</option>
          </Select>
        </div>
      </div>

      {error ? (
        <ErrorState
          title="Failed to Load Quotations"
          message={error}
          onRetry={() => fetchQuotations(1)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredQuotations}
          isLoading={isLoading}
          meta={meta}
          onPageChange={handlePageChange}
          keyExtractor={(q) => q.uuid}
          emptyTitle="No Quotations in Pipeline"
          emptyDescription="Draft new proposals to track client pipeline velocity and order conversions."
        />
      )}
    </div>
  );
};
