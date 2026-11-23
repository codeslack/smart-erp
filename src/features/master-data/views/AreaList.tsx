import React, { useEffect, useState } from 'react';
import { Button, TextInput, Badge } from 'flowbite-react';
import { Search, RefreshCw, Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { masterDataService, type AreaRecord } from '../masterDataService';
import { AreaFormModal } from './AreaFormModal';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { TableColumn } from '@/types/common';

export const AreaList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [areas, setAreas] = useState<AreaRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<AreaRecord | null>(null);
  const [areaToDelete, setAreaToDelete] = useState<AreaRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await masterDataService.getAreas();
      setAreas(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleOpenCreate = () => {
    setSelectedArea(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (area: AreaRecord) => {
    setSelectedArea(area);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!areaToDelete) return;
    try {
      setIsDeleting(true);
      await masterDataService.deleteArea(areaToDelete.uuid);
      dispatch(
        addToast({
          title: 'Area Deleted',
          message: `Area "${areaToDelete.name}" was successfully removed.`,
          type: 'success',
        })
      );
      setAreaToDelete(null);
      fetchAreas();
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Delete Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = areas.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(term) ||
      a.code.toLowerCase().includes(term) ||
      (a.description && a.description.toLowerCase().includes(term))
    );
  });

  const columns: TableColumn<AreaRecord>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (a: AreaRecord) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {a.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Area / Territory Name',
      render: (a: AreaRecord) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0" />
          <span className="font-medium text-gray-900 dark:text-white">{a.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (a: AreaRecord) => (
        <span className="text-gray-600 dark:text-gray-300">
          {a.description || '—'}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (a: AreaRecord) =>
        a.is_active ? (
          <Badge color="success">Active</Badge>
        ) : (
          <Badge color="failure">Inactive</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (a: AreaRecord) => (
        <div className="flex justify-end gap-2">
          <Button
            size="xs"
            color="light"
            onClick={() => handleOpenEdit(a)}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-3 w-3" />
            Edit
          </Button>
          <Button
            size="xs"
            color="failure"
            onClick={() => setAreaToDelete(a)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Areas & Geographic Territories"
        subtitle="Manage geographic sales territories, distribution sectors, and delivery regions."
        breadcrumbs={[{ label: 'Master Data' }, { label: 'Areas' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={fetchAreas} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleOpenCreate} className="flex items-center gap-2">
              <Plus className="h-4 w-4 mr-1" />
              New Area
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Areas"
          message={error}
          onRetry={fetchAreas}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search area code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <DataTable<AreaRecord>
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            keyExtractor={(a) => a.uuid}
            emptyTitle="No Geographic Areas Found"
            emptyDescription="Create your first regional area or distribution territory to group facilities and customers."
          />
        </div>
      )}

      {/* Area Form Modal */}
      <AreaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAreas}
        area={selectedArea}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={Boolean(areaToDelete)}
        title="Delete Area"
        message={`Are you sure you want to delete the area "${areaToDelete?.name}"? Warehouses associated with this area will remain intact.`}
        confirmLabel="Delete Area"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setAreaToDelete(null)}
      />
    </div>
  );
};
