// src/config/navigationMenu.ts
import {
  BookOpen,
  Users,
  FolderHeart,
  Package,
  Layers,
  ShieldAlert,
  Scale,
  ShoppingBag,
  ClipboardCheck,
  ArrowLeftRight,
  Landmark,
  FileText,
  FileSpreadsheet,
  Receipt,
  Wallet,
  BadgePercent,
  ShieldCheck,
  Database,
  UserCheck,
  Key,
  Settings,
} from "lucide-react";

export interface MenuItem {
  title: string;
  path: string;
  icon: any;
  allowedRoles: string[];
}

export interface MenuSection {
  sectionTitle: string;
  items: MenuItem[];
}

export const erpNavigationMap: MenuSection[] = [
  {
    sectionTitle: "Masters",
    items: [
      {
        title: "Customers",
        path: "/masters/customers",
        icon: Users,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Suppliers",
        path: "/masters/suppliers",
        icon: FolderHeart,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Products",
        path: "/masters/products",
        icon: Package,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Categories",
        path: "/masters/categories",
        icon: Layers,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Brands",
        path: "/masters/brands",
        icon: BadgePercent,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Units",
        path: "/masters/units",
        icon: Scale,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Warehouses",
        path: "/masters/warehouses",
        icon: Database,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
    ],
  },
  {
    sectionTitle: "Purchase",
    items: [
      {
        title: "Purchase Orders",
        path: "/purchase/orders",
        icon: ShoppingBag,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Goods Receive Notes",
        path: "/purchase/grn",
        icon: ClipboardCheck,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Purchase Returns",
        path: "/purchase/returns",
        icon: ArrowLeftRight,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
    ],
  },
  {
    sectionTitle: "Sales",
    items: [
      {
        title: "Quotations",
        path: "/sales/quotations",
        icon: FileSpreadsheet,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Sales Orders",
        path: "/sales/orders",
        icon: ClipboardCheck,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Invoices",
        path: "/invoicing",
        icon: Receipt,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Sales Returns",
        path: "/sales/returns",
        icon: ArrowLeftRight,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
    ],
  },
  {
    sectionTitle: "Inventory",
    items: [
      {
        title: "Stock Movement",
        path: "/inventory/movement",
        icon: ArrowLeftRight,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Stock Transfer",
        path: "/inventory/transfer",
        icon: ArrowLeftRight,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
      {
        title: "Stock Adjustment",
        path: "/inventory/adjustment",
        icon: ShieldAlert,
        allowedRoles: ["super_admin", "admin", "staff"],
      },
    ],
  },
  {
    sectionTitle: "Accounting",
    items: [
      {
        title: "Chart of Accounts",
        path: "/accounting",
        icon: Landmark,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Journal",
        path: "/accounting/journals",
        icon: FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Ledger",
        path: "/accounting/ledgers",
        icon: (BookOpen as any) || FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Payments",
        path: "/accounting/payments",
        icon: Wallet,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Expenses",
        path: "/accounting/expenses",
        icon: Wallet,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Bank Accounts",
        path: "/accounting/banks",
        icon: Landmark,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
    ],
  },
  {
    sectionTitle: "Reports",
    items: [
      {
        title: "Trial Balance",
        path: "/accounting",
        icon: FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Profit & Loss",
        path: "/accounting",
        icon: FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Balance Sheet",
        path: "/accounting",
        icon: FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Cash Flow",
        path: "/accounting",
        icon: FileText,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Stock Valuation",
        path: "/reports/stock-valuation",
        icon: Package,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Purchase Report",
        path: "/reports/purchase",
        icon: FileSpreadsheet,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Sales Report",
        path: "/reports/sales",
        icon: FileSpreadsheet,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
      {
        title: "Tax Report",
        path: "/reports/tax",
        icon: BadgePercent,
        allowedRoles: ["super_admin", "admin", "auditor"],
      },
    ],
  },
  {
    sectionTitle: "Administration",
    items: [
      {
        title: "Users",
        path: "/users",
        icon: UserCheck,
        allowedRoles: ["super_admin", "admin"],
      },
      {
        title: "Roles",
        path: "/admin/roles",
        icon: Key,
        allowedRoles: ["super_admin"],
      },
      {
        title: "Permissions",
        path: "/admin/permissions",
        icon: ShieldCheck,
        allowedRoles: ["super_admin"],
      },
      {
        title: "Audit Logs",
        path: "/admin/audit-logs",
        icon: FileText,
        allowedRoles: ["super_admin", "admin"],
      },
      {
        title: "Tenant Settings",
        path: "/admin/settings",
        icon: Settings,
        allowedRoles: ["super_admin"],
      },
    ],
  },
];
