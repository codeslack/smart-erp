import React, { useEffect, useState } from 'react';
import { Button, Card, Badge, Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from 'flowbite-react';
import { RefreshCw, BarChart3, TrendingUp, Scale } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { accountingService } from '../accountingService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import type {
  TrialBalanceReport,
  ProfitLossReport,
  BalanceSheetReport,
} from '@/types/accounting';

export const FinancialReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trial-balance' | 'profit-loss' | 'balance-sheet'>('trial-balance');
  const [trialBalance, setTrialBalance] = useState<TrialBalanceReport | null>(null);
  const [profitLoss, setProfitLoss] = useState<ProfitLossReport | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheetReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [tbRes, plRes, bsRes] = await Promise.allSettled([
        accountingService.getTrialBalance(),
        accountingService.getProfitLoss(),
        accountingService.getBalanceSheet(),
      ]);

      if (tbRes.status === 'fulfilled') setTrialBalance(tbRes.value.data);
      if (plRes.status === 'fulfilled') setProfitLoss(plRes.value.data);
      if (bsRes.status === 'fulfilled') setBalanceSheet(bsRes.value.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Statements & Reports"
        subtitle="Audited financial statements, general ledger summaries, and real-time P&L analytics."
        breadcrumbs={[{ label: 'Accounting' }, { label: 'Financial Reports' }]}
        actions={
          <Button color="light" onClick={fetchReports} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        }
      />

      {error && (
        <ErrorState
          title="Failed to Load Financial Reports"
          message={error}
          onRetry={fetchReports}
        />
      )}

      {/* Report Switcher Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('trial-balance')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'trial-balance'
              ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <Scale className="h-4 w-4" />
          Trial Balance
        </button>
        <button
          onClick={() => setActiveTab('profit-loss')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'profit-loss'
              ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Profit & Loss Statement
        </button>
        <button
          onClick={() => setActiveTab('balance-sheet')}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'balance-sheet'
              ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Balance Sheet
        </button>
      </div>

      {/* Trial Balance View */}
      {activeTab === 'trial-balance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Trial Balance Statement
            </h3>
            {trialBalance && (
              <Badge color={trialBalance.is_balanced ? 'success' : 'failure'}>
                {trialBalance.is_balanced ? 'Balanced' : 'Imbalanced'}
              </Badge>
            )}
          </div>
          <Card>
            <div className="overflow-x-auto">
              <Table hoverable>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Account Code</TableHeadCell>
                    <TableHeadCell>Account Name</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell className="text-right">Debit</TableHeadCell>
                    <TableHeadCell className="text-right">Credit</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody className="divide-y">
                  {trialBalance?.accounts && trialBalance.accounts.length > 0 ? (
                    trialBalance.accounts.map((acc, idx) => (
                      <TableRow key={idx} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell className="font-mono text-xs">{acc.account_code}</TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">{acc.account_name}</TableCell>
                        <TableCell className="capitalize text-xs text-gray-500">{acc.account_type}</TableCell>
                        <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                          {acc.debit > 0 ? formatCurrency(acc.debit) : '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                          {acc.credit > 0 ? formatCurrency(acc.credit) : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No transactions recorded for the trial balance period.
                      </TableCell>
                    </TableRow>
                  )}
                  {trialBalance && (
                    <TableRow className="bg-gray-50 font-bold dark:bg-gray-700">
                      <TableCell colSpan={3} className="text-gray-900 dark:text-white">Total</TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-white">
                        {formatCurrency(trialBalance.total_debit ?? 0)}
                      </TableCell>
                      <TableCell className="text-right text-gray-900 dark:text-white">
                        {formatCurrency(trialBalance.total_credit ?? 0)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* Profit & Loss View */}
      {activeTab === 'profit-loss' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-emerald-500">
              <p className="text-xs font-medium text-gray-500 uppercase">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {formatCurrency(profitLoss?.total_income ?? 0)}
              </p>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <p className="text-xs font-medium text-gray-500 uppercase">Total Expenses</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {formatCurrency(profitLoss?.total_expense ?? 0)}
              </p>
            </Card>
            <Card className="border-l-4 border-l-primary-500">
              <p className="text-xs font-medium text-gray-500 uppercase">Net Profit / (Loss)</p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  (profitLoss?.net_profit ?? 0) >= 0 ? 'text-primary-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(profitLoss?.net_profit ?? 0)}
              </p>
            </Card>
          </div>

          <Card>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
              Income & Expense Breakdown
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                  Operating Income
                </h5>
                <div className="space-y-2">
                  {profitLoss?.income_accounts && profitLoss.income_accounts.length > 0 ? (
                    profitLoss.income_accounts.map((inc, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{inc.account_name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(inc.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No income accounts recorded.</p>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">
                  Operating Expenses
                </h5>
                <div className="space-y-2">
                  {profitLoss?.expense_accounts && profitLoss.expense_accounts.length > 0 ? (
                    profitLoss.expense_accounts.map((exp, i) => (
                      <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-gray-700 dark:text-gray-300">{exp.account_name}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(exp.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No expense accounts recorded.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Balance Sheet View */}
      {activeTab === 'balance-sheet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(balanceSheet?.total_assets ?? 0)}
              </p>
            </Card>
            <Card>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Liabilities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(balanceSheet?.total_liabilities ?? 0)}
              </p>
            </Card>
            <Card>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Equity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(balanceSheet?.total_equity ?? 0)}
              </p>
            </Card>
          </div>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                Assets & Liabilities Position
              </h4>
              {balanceSheet && (
                <Badge color={balanceSheet.is_balanced ? 'success' : 'failure'}>
                  {balanceSheet.is_balanced ? 'Balance Sheet Reconciled' : 'Reconciliation Pending'}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Complete statement of financial position as per the selected fiscal calendar.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
