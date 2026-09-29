// src/features/accounting/views/ProfitLossView.tsx
import React from 'react';
import { useGetProfitLossQuery } from '../api/accountingApi';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner, Alert } from 'flowbite-react';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import type { ProfitLossAccountItem } from '../types';

export const ProfitLossView: React.FC = () => {
  const { data: response, isLoading } = useGetProfitLossQuery();

  if (isLoading) return <div className="text-center p-10"><Spinner size="lg" color="info" /></div>;

  const pl = response?.data;
  const isProfitable = (pl?.net_profit || 0) >= 0;

  const renderRows = (items: ProfitLossAccountItem[] = []) => items.map((item) => (
    <TableRow key={item.account_code} className="bg-white dark:bg-gray-800">
      <TableCell className="py-2.5 font-medium text-gray-700 dark:text-gray-300">
        <span className="font-mono text-xs font-bold text-primary-600 mr-3">{item.account_code}</span>
        {item.account_name}
      </TableCell>
      <TableCell className="py-2.5 text-right font-mono font-bold text-gray-900 dark:text-white">
        ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="space-y-4 font-sans">
      {pl && (
        <Alert color={isProfitable ? 'success' : 'failure'} icon={isProfitable ? TrendingUp : TrendingDown}>
          <span className="font-bold">Net Margin Earnings Summary:</span> {isProfitable ? 'Operational revenue parameters yield a tracking profit surplus.' : 'Trading warning: Accumulated operations tracking a deficit.'}
        </Alert>
      )}

      <div className="overflow-x-auto border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700 text-sm">Operating Income Stream</TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700 text-right text-sm">Amount</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            <TableRow className="bg-gray-100/50 dark:bg-gray-700/30 font-extrabold tracking-wide"><TableCell colSpan={2} className="py-2 text-green-600 text-xs">OPERATING INCOME / REVENUES</TableCell></TableRow>
            {renderRows(pl?.income_accounts)}
            <TableRow className="bg-white dark:bg-gray-800 font-bold border-t-2"><TableCell className="text-gray-900 dark:text-white pl-6">Gross Calculated Income</TableCell><TableCell className="text-right font-mono text-gray-900 dark:text-white">₹{pl?.total_income.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell></TableRow>

            <TableRow className="bg-gray-100/50 dark:bg-gray-700/30 font-extrabold tracking-wide"><TableCell colSpan={2} className="py-2 text-red-500 text-xs">OPERATING DEBITS / EXPENSES</TableCell></TableRow>
            {renderRows(pl?.expense_accounts)}
            <TableRow className="bg-white dark:bg-gray-800 font-bold border-t-2"><TableCell className="text-gray-900 dark:text-white pl-6">Total Accumulated Expenses</TableCell><TableCell className="text-right font-mono text-gray-900 dark:text-white">₹{pl?.total_expense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell></TableRow>

            <TableRow className="bg-gray-50 dark:bg-gray-700/60 font-black text-sm border-t-4 border-double">
              <TableCell className="text-gray-900 dark:text-white flex items-center gap-2"><IndianRupee size={16} className="text-primary-600" /> Net Trading Profit Summary Margin</TableCell>
              <TableCell className={`text-right font-mono text-base font-black ${isProfitable ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                ₹{pl?.net_profit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
