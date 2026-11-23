import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Construction } from 'lucide-react';
import type { BreadcrumbItem } from '@/types/common';

interface PlaceholderPageProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle = 'This module is configured and ready for domain integration.',
  breadcrumbs,
}) => {
  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs || [{ label: title }]}
      />
      <div className="mt-6">
        <EmptyState
          title={`${title} Module`}
          description="This section is connected to the application shell. Full feature controls and server data tables will display here."
          icon={Construction}
        />
      </div>
    </div>
  );
};
