import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  Layers,
  Tag,
  Scale,
  Warehouse,
  Receipt,
  ShoppingCart,
  ShoppingBag,
  FileText,
  RotateCcw,
  BookOpen,
  DollarSign,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const location = useLocation();

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Master Data': true,
    'Sales': false,
    'Purchasing': false,
    'Accounting': false,
  });

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      label: 'Master Data',
      icon: Layers,
      items: [
        { label: 'Customers', href: '/customers', icon: Users },
        { label: 'Suppliers', href: '/suppliers', icon: Building2 },
        { label: 'Products', href: '/products', icon: Package },
        { label: 'Categories', href: '/categories', icon: Tag },
        { label: 'Brands', href: '/brands', icon: Tag },
        { label: 'Units', href: '/units', icon: Scale },
        { label: 'Warehouses', href: '/warehouses', icon: Warehouse },
        { label: 'Payment Terms', href: '/payment-terms', icon: Receipt },
      ],
    },
    {
      label: 'Sales',
      icon: ShoppingCart,
      items: [
        { label: 'Quotations', href: '/sales-quotations', icon: FileText },
        { label: 'Sales Orders', href: '/sales-orders', icon: ShoppingCart },
        { label: 'Invoices', href: '/sales', icon: Receipt },
        { label: 'Sales Returns', href: '/sales-returns', icon: RotateCcw },
      ],
    },
    {
      label: 'Purchasing',
      icon: ShoppingBag,
      items: [
        { label: 'Purchase Orders', href: '/purchases/orders', icon: ShoppingBag },
        { label: 'Goods Receipts (GRN)', href: '/purchases/grn', icon: Package },
        { label: 'Purchase Bills', href: '/purchases/bills', icon: Receipt },
        { label: 'Purchase Returns', href: '/purchases/returns', icon: RotateCcw },
      ],
    },
    {
      label: 'Accounting',
      icon: BookOpen,
      items: [
        { label: 'Chart of Accounts', href: '/accounting/chart-of-accounts', icon: BookOpen },
        { label: 'Journal Entries', href: '/accounting/journal-entries', icon: FileText },
        { label: 'Payments', href: '/payments', icon: DollarSign },
        { label: 'Financial Reports', href: '/reports', icon: BarChart3 },
      ],
    },
  ];

  if (!sidebarOpen) {
    return null;
  }

  return (
    <aside
      className="fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-64 border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800"
      aria-label="Sidebar navigation"
    >
      <div className="h-full overflow-y-auto px-3 py-4">
        <ul className="space-y-1 font-medium">
          {/* Main Dashboard Link */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center rounded-lg p-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' : ''
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>

          {/* Collapsible Domain Groups */}
          {navGroups.map((group) => {
            const GroupIcon = group.icon;
            const isExpanded = Boolean(expandedGroups[group.label]);
            const isGroupActive = group.items.some((item) =>
              location.pathname.startsWith(item.href)
            );

            return (
              <li key={group.label} className="pt-2">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-sm text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                    isGroupActive ? 'font-semibold text-primary-600 dark:text-primary-400' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <GroupIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="ml-3 text-left">{group.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>

                {isExpanded && (
                  <ul className="mt-1 space-y-1 pl-4">
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.href}>
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              `flex items-center rounded-lg py-1.5 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                                isActive
                                  ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                                  : ''
                              }`
                            }
                          >
                            {ItemIcon && <ItemIcon className="mr-2 h-4 w-4" />}
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}

          {/* System & Administration */}
          <li className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="px-3 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
              System
            </span>
          </li>
          <li>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `flex items-center rounded-lg p-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' : ''
                }`
              }
            >
              <ShieldCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="ml-3">Users & RBAC</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center rounded-lg p-2 text-sm text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 ${
                  isActive ? 'bg-primary-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400' : ''
                }`
              }
            >
              <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="ml-3">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};
