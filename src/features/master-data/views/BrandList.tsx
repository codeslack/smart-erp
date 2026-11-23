import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { Search, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { masterDataService } from '../masterDataService';
import { getErrorMessage } from '@/utils/errors';
import type { Brand } from '@/types/product';
import type { TableColumn } from '@/types/common';

export const BrandList: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await masterDataService.getBrands();
      setBrands(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const filtered = brands.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.name.toLowerCase().includes(term) ||
      (b.code && b.code.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<Brand>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (b: Brand) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {b.code || '—'}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Brand Name',
      render: (b: Brand) => (
        <span className="font-medium text-gray-900 dark:text-white">{b.name}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Brands & Manufacturers"
        subtitle="Catalog product brands, manufacturers, and vendor labels."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Brands' }]}
        actions={
          <Button color="light" onClick={fetchBrands} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Brands"
          message={error}
          onRetry={fetchBrands}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search brand name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable<Brand>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            keyExtractor={(b) => b.uuid}
            emptyTitle="No Brands Found"
            emptyDescription="Add manufacturer brands to tag and filter items in your inventory catalog."
          />
        </div>
      )}
    </div>
  );
};
