import React, { useEffect, useState } from 'react';
import { Button, Badge } from 'flowbite-react';
import { Plus, Edit3, Trash2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { productService } from '../productService';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { Category } from '@/types/product';
import type { TableColumn } from '@/types/common';

export const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await productService.getCategories();
      setCategories(res);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await productService.deleteCategory(deleteTarget.uuid);
      dispatch(
        addToast({
          title: 'Category Deleted',
          message: `Category "${deleteTarget.name}" has been removed.`,
          type: 'success',
        })
      );
      setDeleteTarget(null);
      fetchCategories();
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

  const columns: TableColumn<Category>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
          {row.code || '—'}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Category Name',
      render: (row) => (
        <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {row.description || '—'}
        </p>
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
            title="Edit Category"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="xs"
            color="failure"
            onClick={() => setDeleteTarget(row)}
            title="Delete Category"
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
        title="Product Categories"
        subtitle="Manage product classification, hierarchy, and taxonomy groups."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/products">
              <Button color="gray" size="sm">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
            <Button color="gray" size="sm" onClick={fetchCategories}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Button color="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Category
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Categories"
          message={error}
          onRetry={fetchCategories}
        />
      ) : (
        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          keyExtractor={(c) => c.uuid}
          emptyTitle="No Categories Found"
          emptyDescription="Create your first category group to organize your catalog."
          emptyActionLabel="Add Category"
          onEmptyAction={handleOpenCreate}
        />
      )}

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchCategories}
        category={selectedCategory}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        show={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to delete category "${deleteTarget?.name}"?`}
        confirmLabel="Delete Category"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
