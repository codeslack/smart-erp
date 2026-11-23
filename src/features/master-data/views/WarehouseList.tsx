import React, { useEffect, useState } from 'react';
import { Button, TextInput, Badge } from 'flowbite-react';
import { Search, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { masterDataService, type WarehouseRecord } from '../masterDataService';
import { getErrorMessage } from '@/utils/errors';
import type { TableColumn } from '@/types/common';

export const WarehouseList: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await masterDataService.getWarehouses();
      setWarehouses(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filtered = warehouses.filter((w) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      w.name.toLowerCase().includes(term) ||
      w.code.toLowerCase().includes(term) ||
      (w.address && w.address.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<WarehouseRecord>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (w: WarehouseRecord) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {w.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Warehouse Name',
      render: (w: WarehouseRecord) => (
        <div>
          <span className="font-medium text-gray-900 dark:text-white">{w.name}</span>
          {w.is_default && (
            <Badge color="info" size="xs" className="inline ml-2">
              Default Facility
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'contact_person',
      header: 'Contact / Phone',
      render: (w: WarehouseRecord) => (
        <div>
          <p className="text-gray-900 dark:text-white">{w.contact_person || '—'}</p>
          {w.phone && <p className="text-xs text-gray-500">{w.phone}</p>}
        </div>
      ),
    },
    {
      key: 'address',
      header: 'Address / Area',
      render: (w: WarehouseRecord) => w.address || w.area_name || '—',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (w: WarehouseRecord) =>
        w.is_active ? (
          <Badge color="success">Active</Badge>
        ) : (
          <Badge color="failure">Inactive</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses & Storage Facilities"
        subtitle="Manage inventory distribution hubs, receiving depots, and stock locations."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Warehouses' }]}
        actions={
          <Button color="light" onClick={fetchWarehouses} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Warehouses"
          message={error}
          onRetry={fetchWarehouses}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search warehouse code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable<WarehouseRecord>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            keyExtractor={(w) => w.uuid}
            emptyTitle="No Warehouses Configured"
            emptyDescription="Create your main distribution storage facility to begin tracking stock."
          />
        </div>
      )}
    </div>
  );
};
