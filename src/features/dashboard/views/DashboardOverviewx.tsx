import React from "react";
import { useGetDashboardSummaryQuery } from "../api/dashboardApi";
import { Spinner, Card } from "flowbite-react";
import {
  Landmark,
  ReceiptText,
  Users2,
  DollarSign,
  Activity,
  FileJson,
} from "lucide-react";

export const DashboardOverviewx: React.FC = () => {
  const { data: metrics, isLoading, error } = useGetDashboardSummaryQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-20">
        <Spinner size="xl" color="info" />
        <p className="text-sm font-medium text-gray-500">
          Compiling dynamic corporate summaries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-gray-800 dark:text-red-400">
        Configuration Error: Failed to compile overview metrics from Laravel API
        server.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          ERP Control Panel Home
        </h3>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          High-level telemetry and status across active system operational
          sectors.
        </p>
      </div>

      {/* 1. Analytics KPI Matrix Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-gray-100 shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Gross Platform Revenue
              </p>
              <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                $
                {metrics?.total_revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600 dark:bg-green-950/40 dark:text-green-400">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Open Accounts Receivable
              </p>
              <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                $
                {metrics?.open_receivables.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400">
              <ReceiptText size={24} />
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Net Ledger Liquidity
              </p>
              <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                $
                {metrics?.ledger_solvency.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-xl p-3">
              <Landmark size={24} />
            </div>
          </div>
        </Card>

        <Card className="border border-gray-100 shadow-sm dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                Active Personnel Slices
              </p>
              <h4 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.active_personnel} Users
              </h4>
            </div>
            <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <Users2 size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. System Activity Layout Panel */}
      <Card className="border border-gray-100 shadow-sm dark:border-gray-700">
        <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-700">
          <Activity className="text-primary-600 h-5 w-5" />
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Logged Operations
          </h4>
        </div>
        <ul className="divide-y divide-gray-100 font-medium dark:divide-gray-700">
          {metrics?.recent_activity.map((act) => (
            <li
              key={act.id}
              className="flex items-center justify-between py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-lg p-1.5 ${
                    act.type === "invoice"
                      ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20"
                      : act.type === "ledger"
                        ? "bg-primary-50 text-primary-600 dark:bg-primary-950/20"
                        : "bg-purple-50 text-purple-600 dark:bg-purple-950/20"
                  }`}
                >
                  <FileJson size={16} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {act.description}
                </span>
              </div>
              <span className="ml-4 font-mono text-xs whitespace-nowrap text-gray-400 dark:text-gray-500">
                {act.timestamp}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
