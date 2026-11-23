import React, { useEffect, useState } from 'react';
import { Button, TextInput, Badge } from 'flowbite-react';
import { Search, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { masterDataService, type PaymentTermRecord } from '../masterDataService';
import { getErrorMessage } from '@/utils/errors';
import type { TableColumn } from '@/types/common';

export const PaymentTermList: React.FC = () => {
  const [terms, setTerms] = useState<PaymentTermRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await masterDataService.getPaymentTerms();
      setTerms(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const filtered = terms.filter((t) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.code.toLowerCase().includes(term)
    );
  });

  const columns: TableColumn<PaymentTermRecord>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (t: PaymentTermRecord) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {t.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Term Name',
      render: (t: PaymentTermRecord) => (
        <div>
          <span className="font-medium text-gray-900 dark:text-white">{t.name}</span>
          {t.description && <p className="text-xs text-gray-500">{t.description}</p>}
        </div>
      ),
    },
    {
      key: 'due_days',
      header: 'Credit Period',
      render: (t: PaymentTermRecord) => `${t.due_days} Days`,
    },
    {
      key: 'discount_days',
      header: 'Early Discount',
      render: (t: PaymentTermRecord) =>
        t.discount_percent && t.discount_days
          ? `${t.discount_percent}% within ${t.discount_days} days`
          : 'None',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (t: PaymentTermRecord) =>
        t.is_active ? (
          <Badge color="success">Active</Badge>
        ) : (
          <Badge color="failure">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Terms"
        subtitle="Manage credit periods, early payment discount rules, and invoicing terms."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Payment Terms' }]}
        actions={
          <Button color="light" onClick={fetchTerms} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Payment Terms"
          message={error}
          onRetry={fetchTerms}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search payment term..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable<PaymentTermRecord>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            keyExtractor={(t) => t.uuid}
            emptyTitle="No Payment Terms Configured"
            emptyDescription="Configure net-30, cash-on-delivery, or custom payment schedules for customers and suppliers."
          />
        </div>
      )}
    </div>
  );
};
