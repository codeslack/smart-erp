import React from 'react';
import { Breadcrumb, BreadcrumbItem as FlowbiteBreadcrumbItem } from 'flowbite-react';
import { Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/types/common';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-2">
            <FlowbiteBreadcrumbItem icon={Home}>
              <Link to="/dashboard" className="text-gray-500 hover:text-primary-600 dark:text-gray-400">
                Dashboard
              </Link>
            </FlowbiteBreadcrumbItem>
            {breadcrumbs.map((item, idx) => (
              <FlowbiteBreadcrumbItem key={idx}>
                {item.href ? (
                  <Link to={item.href} className="text-gray-500 hover:text-primary-600 dark:text-gray-400">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 dark:text-gray-200">{item.label}</span>
                )}
              </FlowbiteBreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
};
