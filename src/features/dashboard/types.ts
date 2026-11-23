export interface DashboardKpiSummary {
  totalCustomers: number;
  totalRevenue: number;
  openSalesOrders: number;
  openPurchaseOrders: number;
  pendingReceivables: number;
}

export interface MonthlyFinancialTrend {
  month: string;
  revenue: number;
  expenses: number;
  netMargin: number;
}

export interface QuotationFunnelStage {
  stage: string;
  count: number;
  amount: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'sale' | 'purchase_order' | 'customer' | 'quotation';
  title: string;
  description: string;
  amount?: number;
  status: string;
  statusColor: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  timestamp: string;
}

export interface DashboardData {
  kpis: DashboardKpiSummary;
  financialTrends: MonthlyFinancialTrend[];
  quotationFunnel: QuotationFunnelStage[];
  recentActivities: RecentActivityItem[];
}
