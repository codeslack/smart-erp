import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import {
  Users,
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Plus,
  RefreshCw,
  TrendingUp,
  FileText,
  Building2,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatCurrency } from '@/utils/formatters';
import { dashboardService } from '../dashboardService';
import type { DashboardData } from '../types';

export const DashboardOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await dashboardService.getDashboardData();
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load executive dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Executive Dashboard"
          subtitle="Operational overview, business KPIs, and recent activity."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <LoadingSkeleton variant="card" count={4} />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LoadingSkeleton variant="table" count={1} />
          <LoadingSkeleton variant="table" count={1} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Executive Dashboard"
          subtitle="Operational overview, business KPIs, and recent activity."
        />
        <ErrorState
          title="Dashboard Unavailable"
          message={error || 'Unable to connect to backend ERP services.'}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  const { kpis, financialTrends, quotationFunnel, recentActivities } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Operational overview, business KPIs, and live ledger analytics."
        actions={
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm" onClick={fetchDashboardData}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Link to="/customers">
              <Button color="primary" size="sm">
                <Plus className="mr-1.5 h-4 w-4" />
                New Customer
              </Button>
            </Link>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={kpis.totalCustomers.toLocaleString()}
          icon={Users}
          change="+12.4%"
          trend="up"
          timeframe="vs last month"
        />
        <StatCard
          title="Total Sales Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={DollarSign}
          change="+18.2%"
          trend="up"
          timeframe="vs last month"
        />
        <StatCard
          title="Open Sales Orders"
          value={kpis.openSalesOrders.toLocaleString()}
          icon={ShoppingCart}
          change="-3.5%"
          trend="down"
          timeframe="vs last week"
        />
        <StatCard
          title="Pending Receivables"
          value={formatCurrency(kpis.pendingReceivables)}
          icon={CreditCard}
          change="+4.1%"
          trend="neutral"
          timeframe="unsettled"
        />
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 1. AreaChart: Revenue vs Expenses */}
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Revenue vs Expenses (H2)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Monthly revenue inflow and operational expense trends
              </p>
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              +24% Growth
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a56db" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e02424" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#e02424" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} stroke="#6b7280" fontSize={12} />
                <YAxis
                  tickLine={false}
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#1a56db"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#e02424"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 2. BarChart: Sales Quotation Conversion Funnel */}
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Quotation Pipeline Funnel
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Conversion stages from Drafted to Converted Sales Order
              </p>
            </div>
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
              Pipeline Velocity
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quotationFunnel} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="stage" tickLine={false} stroke="#6b7280" fontSize={12} />
                <YAxis
                  tickLine={false}
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Amount']}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '0.5rem',
                    color: '#f9fafb',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="amount"
                  name="Pipeline Value"
                  fill="#0e9f6e"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Operational Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions Table */}
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
            <Link
              to="/sales"
              className="inline-flex items-center text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              View all sales <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Transaction</TableHeadCell>
                  <TableHeadCell>Details</TableHeadCell>
                  <TableHeadCell>Amount</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Time</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((act) => (
                  <TableRow key={act.id} className="bg-white dark:bg-gray-800">
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {act.type === 'sale' && <FileText className="h-4 w-4 text-primary-600" />}
                        {act.type === 'purchase_order' && <ShoppingBag className="h-4 w-4 text-amber-500" />}
                        {act.type === 'quotation' && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                        {act.type === 'customer' && <Users className="h-4 w-4 text-emerald-500" />}
                        <span>{act.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                      {act.description}
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900 dark:text-white">
                      {act.amount !== undefined ? formatCurrency(act.amount) : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={
                          act.statusColor === 'green'
                            ? 'success'
                            : act.statusColor === 'yellow'
                            ? 'warning'
                            : act.statusColor === 'blue'
                            ? 'info'
                            : 'gray'
                        }
                      >
                        {act.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                      {act.timestamp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Quick Operational Shortcuts */}
        <div className="space-y-6">
          <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="border-b border-gray-200 pb-4 text-base font-semibold text-gray-900 dark:text-white dark:border-gray-700">
              Operational Shortcuts
            </h3>
            <div className="space-y-3 pt-2">
              <Link
                to="/customers"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-blue-100 p-2 text-primary-600 dark:bg-blue-900/40 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Customers</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage directory & credit</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                to="/sales"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Sales Invoices</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Billing & receipts</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                to="/purchases"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Purchase Orders</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Procurement & bills</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>

              <Link
                to="/accounting/chart-of-accounts"
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">General Ledger</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Chart of accounts & balances</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
