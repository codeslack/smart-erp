import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '@/features/auth/views/Login';
import { TenantOnboarding } from '@/features/onboarding/views/TenantOnboarding';
import { DashboardOverview } from '@/features/dashboard/views/DashboardOverview';
import { CustomerList } from '@/features/customers';
import { SupplierList } from '@/features/suppliers';
import { ProductList, CategoryList } from '@/features/products';
import { SalesList, SalesOrderList, SalesQuotationList } from '@/features/sales';
import { PurchaseOrderList, PurchaseInvoiceList, PurchaseReturnList } from '@/features/purchases';
import { ChartOfAccountsView, JournalEntriesView, PaymentListView, FinancialReportsView } from '@/features/accounting';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';
import NotFound from '@/components/NotFound';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Route */}
        <Route path="/login" element={<Login />} />

        {/* Tenant Onboarding / Company Registration (Accessible directly or when tenant is missing) */}
        <Route path="/onboarding/tenant" element={<TenantOnboarding />} />

        {/* Protected ERP Main Routes (Require Authentication AND an Active Tenant) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardOverview />} />

            {/* Master Data */}
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route
              path="/brands"
              element={
                <PlaceholderPage
                  title="Brands"
                  subtitle="Manufacturer and brand classifications."
                  breadcrumbs={[{ label: 'Master Data' }, { label: 'Brands' }]}
                />
              }
            />
            <Route
              path="/units"
              element={
                <PlaceholderPage
                  title="Units of Measurement"
                  subtitle="Base measurement units and conversion factors."
                  breadcrumbs={[{ label: 'Master Data' }, { label: 'Units' }]}
                />
              }
            />
            <Route
              path="/warehouses"
              element={
                <PlaceholderPage
                  title="Warehouses"
                  subtitle="Storage facilities, locations, and inventory distribution hubs."
                  breadcrumbs={[{ label: 'Master Data' }, { label: 'Warehouses' }]}
                />
              }
            />
            <Route
              path="/payment-terms"
              element={
                <PlaceholderPage
                  title="Payment Terms"
                  subtitle="Credit periods, due dates, and default invoicing terms."
                  breadcrumbs={[{ label: 'Master Data' }, { label: 'Payment Terms' }]}
                />
              }
            />

            {/* Sales */}
            <Route path="/sales-quotations" element={<SalesQuotationList />} />
            <Route path="/sales-orders" element={<SalesOrderList />} />
            <Route path="/sales" element={<SalesList />} />
            <Route
              path="/sales-returns"
              element={
                <PlaceholderPage
                  title="Sales Returns"
                  subtitle="Customer credit notes, item returns, and inventory restock."
                  breadcrumbs={[{ label: 'Sales' }, { label: 'Returns' }]}
                />
              }
            />

            {/* Purchasing */}
            <Route path="/purchases/orders" element={<PurchaseOrderList />} />
            <Route path="/purchases" element={<Navigate to="/purchases/bills" replace />} />
            <Route path="/purchases/bills" element={<PurchaseInvoiceList />} />
            <Route path="/purchases/returns" element={<PurchaseReturnList />} />
            <Route
              path="/purchases/grn"
              element={
                <PlaceholderPage
                  title="Goods Receipt Notes (GRN)"
                  subtitle="Warehouse receiving receipts and physical stock intake verification."
                  breadcrumbs={[{ label: 'Purchasing' }, { label: 'GRN' }]}
                />
              }
            />

            {/* Accounting */}
            <Route path="/accounting/chart-of-accounts" element={<ChartOfAccountsView />} />
            <Route path="/accounting/journal-entries" element={<JournalEntriesView />} />
            <Route path="/payments" element={<PaymentListView />} />
            <Route path="/reports" element={<FinancialReportsView />} />

            {/* System */}
            <Route
              path="/employees"
              element={
                <PlaceholderPage
                  title="Users & Access Control"
                  subtitle="User directory, roles, and granular tenant permissions."
                  breadcrumbs={[{ label: 'System' }, { label: 'Users & RBAC' }]}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <PlaceholderPage
                  title="System Settings"
                  subtitle="Organization profile, financial years, numbering schemes, and preferences."
                  breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
                />
              }
            />
          </Route>
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
