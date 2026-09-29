// src/features/invoicing/views/InvoicingDashboard.tsx
import React, { useState } from 'react';
import { useGetInvoicingDashboardQuery } from '../api/invoicingApi';
import { useAppDispatch } from '@/store/hooks';
import { openGlobalDrawer } from '@/store/uiSlice';
import { InvoicingSummaryCards } from './InvoicingSummaryCards';
import { InvoicingTablePane } from './InvoicingTablePane';
import { Button, TextInput, Spinner } from 'flowbite-react';
import { ReceiptText, Plus, Search } from 'lucide-react';

export const InvoicingDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetInvoicingDashboardQuery({ page, search });

  if (isLoading) return <div className="text-center p-20"><Spinner size="lg" color="info" /></div>;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><ReceiptText className="text-primary-600" /> Accounts Receivable</h3>
        </div>
        <Button size="sm" color="blue" onClick={() => dispatch(openGlobalDrawer({ contentType: 'CREATE_INVOICE' }))} className="font-semibold"><Plus className="mr-2 h-4 w-4" /> Issue Invoice</Button>
      </div>

      <InvoicingSummaryCards summary={data?.summary} />

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
        <div className="max-w-xs">
          <TextInput id="inv-search" type="text" placeholder="Search invoices..." icon={Search as any} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <InvoicingTablePane invoicesData={data?.invoices} page={page} setPage={setPage} />
      </div>
    </div>
  );
};
