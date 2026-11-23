import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { accountingService } from '../accountingService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import type { ChartOfAccount } from '@/types/accounting';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const ChartOfAccountsView: React.FC = () => {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await accountingService.getChartOfAccounts({
        page,
        per_page: 25,
        account_type: typeFilter !== 'all' ? typeFilter : undefined,
      });
      setAccounts(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(1);
  }, [typeFilter]);

  const handlePageChange = (newPage: number) => {
    fetchAccounts(newPage);
  };

  const filteredAccounts = accounts.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.account_name.toLowerCase().includes(term) ||
      a.account_code.toLowerCase().includes(term) ||
      (a.account_group_name && a.account_group_name.toLowerCase().includes(term))
    );
  });

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case 'asset':
        return <Badge color="info">Asset</Badge>;
      case 'liability':
        return <Badge color="failure">Liability</Badge>;
      case 'equity':
        return <Badge color="purple">Equity</Badge>;
      case 'income':
        return <Badge color="success">Income</Badge>;
      case 'expense':
        return <Badge color="warning">Expense</Badge>;
      default:
        return <Badge color="gray">{type}</Badge>;
    }
  };

  const columns: TableColumn<ChartOfAccount>[] = [
    {
      key: 'account_code',
      header: 'Code',
      render: (a: ChartOfAccount) => (
        <span className="font-mono font-semibold text-gray-900 dark:text-white">
          {a.account_code}
        </span>
      ),
    },
    {
      key: 'account_name',
      header: 'Account Name',
      render: (a: ChartOfAccount) => (
        <div>
          <span className="font-medium text-gray-900 dark:text-white">
            {a.account_name}
          </span>
          {a.is_system && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
              System
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'account_type',
      header: 'Type',
      render: (a: ChartOfAccount) => getAccountTypeBadge(a.account_type),
    },
    {
      key: 'account_group_name',
      header: 'Account Group',
      render: (a: ChartOfAccount) => a.account_group_name || '—',
    },
    {
      key: 'current_balance',
      header: 'Balance',
      className: 'text-right',
      render: (a: ChartOfAccount) => (
        <span
          className={`font-semibold ${
            a.current_balance < 0
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {formatCurrency(a.current_balance)}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (a: ChartOfAccount) =>
        a.is_active ? (
          <Badge color="success">Active</Badge>
        ) : (
          <Badge color="gray">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chart of Accounts"
        subtitle="General ledger structure, classifications, and active ledger balances."
        breadcrumbs={[{ label: 'Accounting' }, { label: 'Chart of Accounts' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchAccounts(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Chart of Accounts"
          message={error}
          onRetry={() => fetchAccounts(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search code, name, or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-44"
              >
                <option value="all">All Types</option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
          </div>

          <DataTable<ChartOfAccount>
            columns={columns}
            data={filteredAccounts}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(a) => a.uuid}
            emptyTitle="No Accounts Found"
            emptyDescription="Ensure accounting chart of accounts is configured or seeded in this company tenant."
          />
        </div>
      )}
    </div>
  );
};
