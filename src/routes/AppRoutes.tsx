import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { Login } from "@/features/auth";
import { UserList } from "@/features/user-management";
import { ModulePlaceholder } from "@/components/ModulePlaceholder"; // Load your placeholder helper

import { AreaListView } from "@/features/masters/areas";
import { BrandListView } from "@/features/masters/brands";
import { UnitListView } from "@/features/masters/units";
import { CategoryListView } from "@/features/masters/categories";
import { WarehouseListPane } from "@/features/masters/warehouses";
// import { ProductListView } from "@/features/masters/products";
import { CustomerListPane } from "@/features/masters/customers";
import { SupplierListPane } from "@/features/masters/suppliers";

import {
  ProductListView,
  ProductFormModal,
  // ProductDetailPane,
  // VariantListPane,
  // VariantFormModal,
} from "@/features/masters/products";

import {
  PurchaseOrderPane,
  PurchaseListPane,
  GoodsReceivePane,
  PurchaseReturnPane,
} from "@/features/purchase";

import { ChartOfAccounts, JournalEntriesPane } from "@/features/accounting";
import { InvoicingDashboard } from "@/features/invoicing";
import { DashboardOverview } from "@/features/dashboard";
import NotFound from "@/components/NotFound";

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Real Dashboard Overview Home Map Active */}
            <Route path="/dashboard" element={<DashboardOverview />} />

            <Route path="/invoicing" element={<InvoicingDashboard />} />
            <Route path="/accounting" element={<ChartOfAccounts />} />
            <Route
              path="/accounting/journals"
              element={<JournalEntriesPane />}
            />
            <Route path="/users" element={<UserList />} />
            {/* --- CORE MASTER MODULE SHELLS --- */}
            <Route path="/masters/areas" element={<AreaListView />} />
            <Route path="/masters/brands" element={<BrandListView />} />
            <Route path="/masters/units" element={<UnitListView />} />
            <Route path="/masters/categories" element={<CategoryListView />} />
            <Route path="/masters/warehouses" element={<WarehouseListPane />} />

            {/* Core Product Routing Map */}
            <Route path="/masters/products" element={<ProductListView />} />
            <Route
              path="/masters/products/create"
              element={<ProductFormModal />}
            />
            {/* <Route
              path="/masters/products/:uuid"
              element={<ProductDetailPane />}
            /> */}
            <Route
              path="/masters/products/:uuid/edit"
              element={<ProductFormModal />}
            />

            {/* Dynamic Nested Sub-variants Mapping */}
            {/* <Route
              path="/masters/products/:productUuid/variants"
              element={<VariantListPane />}
            /> */}
            {/* <Route
              path="/masters/products/:productUuid/variants/create"
              element={<VariantFormModal />}
            /> */}

            <Route path="/masters/customers" element={<CustomerListPane />} />
            <Route path="/masters/suppliers" element={<SupplierListPane />} />

            <Route path="/masters/areas" element={<ModulePlaceholder />} />
            <Route path="/masters/customers" element={<ModulePlaceholder />} />
            <Route path="/masters/suppliers" element={<ModulePlaceholder />} />
            <Route path="/masters/products" element={<ModulePlaceholder />} />
            <Route path="/masters/categories" element={<ModulePlaceholder />} />
            <Route path="/masters/units" element={<ModulePlaceholder />} />
            <Route path="/masters/warehouses" element={<ModulePlaceholder />} />

            {/* --- CORE PURCHASE MODULE SHELLS --- */}
            <Route path="/purchase/orders" element={<PurchaseOrderPane />} />
            <Route path="/purchase/invoices" element={<PurchaseListPane />} />
            <Route path="/purchase/grn" element={<GoodsReceivePane />} />
            <Route path="/purchase/returns" element={<PurchaseReturnPane />} />

            {/* --- CORE SALES MODULE SHELLS --- */}
            <Route path="/sales/quotations" element={<ModulePlaceholder />} />
            <Route path="/sales/orders" element={<ModulePlaceholder />} />
            <Route path="/sales/returns" element={<ModulePlaceholder />} />

            {/* --- CORE INVENTORY MODULE SHELLS --- */}
            <Route path="/inventory/movement" element={<ModulePlaceholder />} />
            <Route path="/inventory/transfer" element={<ModulePlaceholder />} />
            <Route
              path="/inventory/adjustment"
              element={<ModulePlaceholder />}
            />

            {/* --- OTHER EXTENDED REPORT SHELLS --- */}
            <Route
              path="/reports/stock-valuation"
              element={<ModulePlaceholder />}
            />
            <Route path="/reports/purchase" element={<ModulePlaceholder />} />
            <Route path="/reports/sales" element={<ModulePlaceholder />} />
            <Route path="/reports/tax" element={<ModulePlaceholder />} />

            {/* --- ADMINISTRATION UTILITY MODULE SHELLS --- */}
            <Route path="/admin/roles" element={<ModulePlaceholder />} />
            <Route path="/admin/permissions" element={<ModulePlaceholder />} />
            <Route path="/admin/audit-logs" element={<ModulePlaceholder />} />
            <Route path="/admin/settings" element={<ModulePlaceholder />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
