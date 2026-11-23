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
            <Route
              path="/purchases/orders"
              element={
                <PlaceholderPage
                  title="Purchase Orders"
                  subtitle="Vendor purchase orders, approvals, and order tracking."
                  breadcrumbs={[{ label: 'Purchasing' }, { label: 'Orders' }]}
                />
              }
            />
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
            <Route
              path="/purchases/bills"
              element={
                <PlaceholderPage
                  title="Purchase Bills"
                  subtitle="Supplier bills, payable matching, and accounting vouchers."
                  breadcrumbs={[{ label: 'Purchasing' }, { label: 'Bills' }]}
                />
              }
            />
            <Route
              path="/purchases/returns"
              element={
                <PlaceholderPage
                  title="Purchase Returns"
                  subtitle="Debit notes and vendor returns."
                  breadcrumbs={[{ label: 'Purchasing' }, { label: 'Returns' }]}
                />
              }
            />

            {/* Accounting */}
            <Route
              path="/accounting/chart-of-accounts"
              element={
                <PlaceholderPage
                  title="Chart of Accounts"
                  subtitle="General ledger structure, account hierarchy, and financial groups."
                  breadcrumbs={[{ label: 'Accounting' }, { label: 'Chart of Accounts' }]}
                />
              }
            />
            <Route
              path="/accounting/journal-entries"
              element={
                <PlaceholderPage
                  title="Journal Entries"
                  subtitle="General journal vouchers, financial transactions, and postings."
                  breadcrumbs={[{ label: 'Accounting' }, { label: 'Journal Entries' }]}
                />
              }
            />
            <Route
              path="/payments"
              element={
                <PlaceholderPage
                  title="Payments & Receipts"
                  subtitle="Customer receipts, supplier disbursements, and bank allocations."
                  breadcrumbs={[{ label: 'Accounting' }, { label: 'Payments' }]}
                />
              }
            />
            <Route
              path="/reports"
              element={
                <PlaceholderPage
                  title="Financial Reports"
                  subtitle="Trial balance, balance sheet, profit & loss, cash book, and aging reports."
                  breadcrumbs={[{ label: 'Accounting' }, { label: 'Reports' }]}
                />
              }
            />

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
