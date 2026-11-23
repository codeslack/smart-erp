import React, { useEffect, useState, useMemo } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Plus, Search, Edit3, Trash2, RefreshCw, FolderTree } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { ProductFormModal } from '../components/ProductFormModal';
import { productService } from '../productService';
import { formatCurrency } from '@/utils/formatters';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { Product, Category } from '@/types/product';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchProducts = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await productService.getProducts({
        page,
        per_page: 15,
        search: searchTerm.trim() || undefined,
      });
      setProducts(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    productService.getCategories().then((cats) => setCategories(cats)).catch(() => {});
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setSelectedProduct(prod);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await productService.deleteProduct(deleteTarget.uuid);
      dispatch(
        addToast({
          title: 'Product Deleted',
          message: `Product "${deleteTarget.name}" has been removed.`,
          type: 'success',
        })
      );
      setDeleteTarget(null);
      fetchProducts(currentPage);
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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.barcode && p.barcode.includes(searchTerm));

      const matchesCategory =
        categoryFilter === 'all' ||
        p.category_uuid === categoryFilter ||
        p.category?.uuid === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.is_active) ||
        (statusFilter === 'inactive' && !p.is_active);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const columns: TableColumn<Product>[] = [
    {
      key: 'identity',
      header: 'Code / SKU',
      render: (row) => (
        <div className="font-mono text-xs">
          <p className="font-semibold text-primary-600 dark:text-primary-400">{row.code}</p>
          {row.sku && <p className="text-gray-500">SKU: {row.sku}</p>}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {row.product_type}
            </span>
            {row.unit_name && (
              <span className="text-[10px] text-gray-400">({row.unit_name})</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category / Brand',
      render: (row) => (
        <div className="text-xs">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {row.category_name || row.category?.name || 'Unassigned'}
          </p>
          <p className="text-gray-500">{row.brand_name || row.brand?.name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'pricing',
      header: 'Prices',
      render: (row) => (
        <div className="text-xs">
          <p className="font-semibold text-gray-900 dark:text-white">
            Sell: {row.selling_price ? formatCurrency(row.selling_price) : '—'}
          </p>
          <p className="text-gray-500">
            Cost: {row.purchase_price ? formatCurrency(row.purchase_price) : '—'}
          </p>
        </div>
      ),
    },
    {
      key: 'stock',
      header: 'Stock Alert',
      render: (row) => (
        <div className="text-xs">
          <p className="text-gray-700 dark:text-gray-300">
            Min: {row.minimum_stock ?? '—'}
          </p>
          <p className="text-gray-500">
            Reorder: {row.reorder_level ?? '—'}
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
            title="Edit Product"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="xs"
            color="failure"
            onClick={() => setDeleteTarget(row)}
            title="Delete Product"
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
        title="Products & Inventory"
        subtitle="Catalog items, pricing matrices, SKUs, inventory tracking, and stock thresholds."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/categories">
              <Button color="gray" size="sm">
                <FolderTree className="mr-1.5 h-4 w-4" />
                Categories
              </Button>
            </Link>
            <Button color="gray" size="sm" onClick={() => fetchProducts(currentPage)}>
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Refresh
            </Button>
            <Button color="primary" size="sm" onClick={handleOpenCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative w-full">
            <TextInput
              id="product-search"
              icon={Search}
              placeholder="Search by name, SKU, barcode, code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-44"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.uuid} value={c.uuid}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-32"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      {error ? (
        <ErrorState
          title="Failed to Load Products"
          message={error}
          onRetry={() => fetchProducts(1)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProducts}
          isLoading={isLoading}
          meta={meta}
          onPageChange={handlePageChange}
          keyExtractor={(p) => p.uuid}
          emptyTitle="No Products in Catalog"
          emptyDescription="Start building your inventory catalog by registering your first product."
          emptyActionLabel="Add Product"
          onEmptyAction={handleOpenCreate}
        />
      )}

      {/* Create / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => fetchProducts(currentPage)}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        show={Boolean(deleteTarget)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}" (${deleteTarget?.code})? This will archive the item.`}
        confirmLabel="Delete Product"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
