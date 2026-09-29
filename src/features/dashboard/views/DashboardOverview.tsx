import React from 'react';
import { useGetDashboardSummaryQuery } from '../api/dashboardApi';
import { Spinner, Card } from 'flowbite-react';
import { Landmark, ReceiptText, Users2, DollarSign, Activity, FileJson } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data: metrics, isLoading, error } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-3">
        <Spinner size="xl" color="info" />
        <p className="text-gray-500 text-sm font-medium">Compiling dynamic corporate summaries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 font-medium">
        Configuration Error: Failed to compile overview metrics from Laravel API server.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">ERP Control Panel Home</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">High-level telemetry and status across active system operational sectors.</p>
      </div>

      {/* 1. Analytics KPI Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Gross Platform Revenue</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {/* ${metrics?.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
              </h4>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Open Accounts Receivable</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {/* ${metrics?.open_receivables.toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
              </h4>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 rounded-xl">
              <ReceiptText size={24} />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Net Ledger Liquidity</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {/* ${metrics?.ledger_solvency.toLocaleString(undefined, { minimumFractionDigits: 2 })} */}
              </h4>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl">
              <Landmark size={24} />
            </div>
          </div>
        </Card>

        <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Active Personnel Slices</p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {/* {metrics?.active_personnel} Users */}
              </h4>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users2 size={24} />
            </div>
          </div>
        </Card>

      </div>

      {/* 2. System Activity Layout Panel */}
      <Card className="shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-2 flex items-center gap-2">
          <Activity className="text-primary-600 h-5 w-5" />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">Recent Logged Operations</h4>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700 font-medium">
          {/* {metrics?.recent_activity.map((act) => (
            <li key={act.id} className="py-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${
                  act.type === 'invoice' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20' :
                  act.type === 'ledger' ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/20' :
                  'bg-purple-50 text-purple-600 dark:bg-purple-950/20'
                }`}>
                  <FileJson size={16} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">{act.description}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono whitespace-nowrap ml-4">{act.timestamp}</span>
            </li>
          ))} */}
        </ul>
      </Card>
    </div>
  );
};
