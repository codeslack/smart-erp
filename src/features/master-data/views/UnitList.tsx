import React, { useEffect, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { Search, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ErrorState } from '@/components/ui/ErrorState';
import { masterDataService } from '../masterDataService';
import { getErrorMessage } from '@/utils/errors';
import type { Unit } from '@/types/product';
import type { TableColumn } from '@/types/common';

export const UnitList: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await masterDataService.getUnits();
      setUnits(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const filtered = units.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      (u.code && u.code.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<Unit>[] = [
    {
      key: 'code',
      header: 'Symbol / Code',
      render: (u: Unit) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {u.code || '—'}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Unit Name',
      render: (u: Unit) => (
        <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Units of Measurement"
        subtitle="Manage inventory measurement units (kg, pcs, box, meters) and unit conversions."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Units' }]}
        actions={
          <Button color="light" onClick={fetchUnits} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Units"
          message={error}
          onRetry={fetchUnits}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search unit name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable<Unit>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            keyExtractor={(u) => u.uuid}
            emptyTitle="No Units Defined"
            emptyDescription="Base units of measurement specify how stock is counted and packaged."
          />
        </div>
      )}
    </div>
  );
};
