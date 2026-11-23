import React, { useEffect, useState, useMemo } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Plus, Search, Edit3, Trash2, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { SupplierFormModal } from '../components/SupplierFormModal';
import { supplierService } from '../supplierService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { Supplier } from '@/types/supplier';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const SupplierList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchSuppliers = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await supplierService.getSuppliers({
        page,
        per_page: 15,
        search: searchTerm.trim() || undefined,
      });
      setSuppliers(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchSuppliers(newPage);
  };

  const handleOpenCreate = () => {
    setSelectedSupplier(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (supp: Supplier) => {
    setSelectedSupplier(supp);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await supplierService.deleteSupplier(deleteTarget.uuid);
      dispatch(
        addToast({
          title: 'Supplier Deleted',
          message: `Supplier "${deleteTarget.name}" has been removed.`,
          type: 'success',
        })
      );
      setDeleteTarget(null);
      fetchSuppliers(currentPage);
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

  // Client-side filtering when backend query scopes are not yet dynamic
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        searchTerm === '' ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.phone && s.phone.includes(searchTerm));

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && s.is_active) ||
        (statusFilter === 'inactive' && !s.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchTerm, statusFilter]);

  const columns: TableColumn<Supplier>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
          {row.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Supplier Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          {row.contact_person && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Attn: {row.contact_person}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          {row.email && <p className="text-gray-600 dark:text-gray-300">{row.email}</p>}
          {row.phone && <p className="text-gray-500 dark:text-gray-400">{row.phone}</p>}
          {!row.email && !row.phone && <span className="text-gray-400">—</span>}
        </div>
      ),
    },
    {
      key: 'tax_number',
      header: 'Tax ID / VAT',
      render: (row) => (
        <div className="text-xs">
          {row.tax_number ? (
            <p className="font-mono text-gray-700 dark:text-gray-300">{row.tax_number}</p>
          ) : (
            <span className="text-gray-400">No Tax ID</span>
          )}
        </div>
      ),
    },
    {
      key: 'credit',
      header: 'Credit Terms',
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-gray-900 dark:text-white">
            {row.credit_limit ? formatCurrency(row.credit_limit) : 'No Limit'}
          </p>
          <p className="text-gray-500">
            {row.credit_days ? `${row.credit_days} days` : 'Net 0'}
            {row.credit_control !== 'none' && (
              <span className="ml-1 text-[10px] text-amber-600 uppercase">
                ({row.credit_control})
              </span>
            )}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge color={row.is_active ? 'success' : 'failure'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            size="xs"
            color="gray"
            onClick={() => handleOpenEdit(row)}
            title="Edit Supplier"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="xs"
            color="failure"
            onClick={() => setDeleteTarget(row)}
            title="Delete Supplier"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        subtitle="Manage vendors, procurement contacts, tax details, and payment credit terms."
        actions={
          <div className="flex items-center gap-2">
            <Button color="gray" size="sm" onClick={() => fetchSuppliers(currentPage)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Button color="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative w-full">
            <TextInput
              id="supplier-search"
              icon={Search}
              placeholder="Search by vendor name, code, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-36"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      {error ? (
        <ErrorState
          title="Failed to Load Suppliers"
          message={error}
          onRetry={() => fetchSuppliers(1)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          isLoading={isLoading}
          meta={meta}
          onPageChange={handlePageChange}
          keyExtractor={(s) => s.uuid}
          emptyTitle="No Suppliers Found"
          emptyDescription="Start building your procurement directory by adding your first supplier record."
          emptyActionLabel="Add Supplier"
          onEmptyAction={handleOpenCreate}
        />
      )}

      {/* Create / Edit Form Modal */}
      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchSuppliers(currentPage)}
        supplier={selectedSupplier}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        show={Boolean(deleteTarget)}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.code})? This action cannot be undone.`}
        confirmLabel="Delete Supplier"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
