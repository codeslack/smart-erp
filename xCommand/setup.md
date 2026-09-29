# Step 1: Set Up Types src/features/masters/products/types/productTypes.ts
```typescript
export interface Product {
  id: number;
  tenant_id: number;
  category_id: number;
  unit_id: number;
  brand_id: number | null;
  name: string;
  sku: string;
  barcode: string | null;
  purchase_price: number;
  sale_price: number;
  minimum_stock: number | null;
  description: string | null;
  is_active: boolean;
  category?: { name: string };
  unit?: { short_name: string };
  brand?: { name: string };
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: LaravelPaginationMeta;
}
```
# Step 2: Inject CRUD Mutation Hooks (src/features/masters/products/api/productsApi.ts)
```typescript
import { apiSlice } from '@/store/apiSlice';
import type { PaginatedProducts, Product } from '../types/productTypes';

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProducts, { page: number; search: string }>({
      query: ({ page, search }) => ({ url: '/api/products', method: 'GET', params: { page, search } }),
      providesTags: ['Accounts'],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({ url: '/api/products', method: 'POST', data: body }),
      invalidatesTags: ['Accounts'],
    }),
    updateProduct: builder.mutation<Product, { id: number; body: Partial<Product> }>({
      query: ({ id, body }) => ({ url: `/api/products/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Accounts'],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({ url: `/api/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Accounts'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
```
# Step 3: Centered Action Modal Form (src/features/masters/products/views/ProductFormModal.tsx)
```tsx
import React, { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../api/productsApi';
import { useGetCategoriesQuery } from '../../categories/api/categoriesApi';
import { useGetUnitsQuery } from '../../units/api/unitsApi';
import { useGetBrandsQuery } from '../../brands/api/brandsApi';
import { Modal, ModalHeader, ModalBody, Button, Label, TextInput, Select, Spinner, ToggleSwitch } from 'flowbite-react';
import { getFieldError } from '@/utils/errorMapper';
import { InputError } from '@/components/InputError';
import { Package } from 'lucide-react';

export const ProductFormModal: React.FC<{ show: boolean; onClose: () => void; editTarget: any }> = ({ show, onClose, editTarget }) => {
  const [catId, setCatId] = useState(''), [unitId, setUnitId] = useState(''), [brandId, setBrandId] = useState('');
  const [name, setName] = useState(''), [sku, setSku] = useState(''), [barcode, setBarcode] = useState('');
  const [pPrice, setPPrice] = useState('0'), [sPrice, setSPrice] = useState('0'), [mStock, setMStock] = useState('0');
  const [desc, setDesc] = useState(''), [isActive, setIsActive] = useState(true);

  const { data: cats } = useGetCategoriesQuery({ page: 1, search: '' }), { data: units } = useGetUnitsQuery({ page: 1, search: '' }), { data: brands } = useGetBrandsQuery({ page: 1, search: '' });
  const [createProduct, { isLoading: isCreating, error: cErr }] = useCreateProductMutation(), [updateProduct, { isLoading: isUpdating, error: uErr }] = useUpdateProductMutation();
  const error = editTarget ? uErr : cErr, isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editTarget) {
      setCatId(String(editTarget.category_id)); setUnitId(String(editTarget.unit_id)); setBrandId(String(editTarget.brand_id || ''));
      setName(editTarget.name); setSku(editTarget.sku); setBarcode(editTarget.barcode || '');
      setPPrice(String(editTarget.purchase_price)); setSPrice(String(editTarget.sale_price)); setMStock(String(editTarget.minimum_stock || '0'));
      setDesc(editTarget.description || ''); setIsActive(editTarget.is_active);
    } else {
      setCatId(''); setUnitId(''); setBrandId(''); setName(''); setSku(''); setBarcode(''); setPPrice('0'); setSPrice('0'); setMStock('0'); setDesc(''); setIsActive(true);
    }
  }, [editTarget, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      category_id: Number(catId), unit_id: Number(unitId), brand_id: brandId ? Number(brandId) : null,
      name, sku, barcode: barcode || null, purchase_price: parseFloat(pPrice), sale_price: parseFloat(sPrice),
      minimum_stock: mStock ? parseFloat(mStock) : null, description: desc || null, is_active: isActive
    };
    try {
      if (editTarget) { await updateProduct({ id: editTarget.id, body: payload }).unwrap(); }
      else { await createProduct(payload).unwrap(); }
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="lg" popup>
      <ModalHeader className="border-b p-4 dark:border-gray-700"><span className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-white"><Package size={20} /> {editTarget ? 'Modify Product' : 'Register Product'}</span></ModalHeader>
      <ModalBody className="p-6 overflow-y-auto max-h-[80vh]">
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Category</Label><Select value={catId} onChange={(e) => setCatId(e.target.value)} required>{<option value="">Select...</option>}{cats?.data.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
            <div><Label>Unit</Label><Select value={unitId} onChange={(e) => setUnitId(e.target.value)} required>{<option value="">Select...</option>}{units?.data.map(u => <option key={u.id} value={u.id}>{u.short_name}</option>)}</Select></div>
            <div><Label>Brand</Label><Select value={brandId} onChange={(e) => setBrandId(e.target.value)}>{<option value="">None</option>}{brands?.data.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></div>
          </div>
          <div><Label>Product Name</Label><TextInput required value={name} onChange={(e) => setName(e.target.value)} color={getFieldError(error, 'name') ? 'failure' : 'gray'} /><InputError message={getFieldError(error, 'name')} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>SKU String</Label><TextInput required value={sku} onChange={(e) => setSku(e.target.value)} color={getFieldError(error, 'sku') ? 'failure' : 'gray'} /><InputError message={getFieldError(error, 'sku')} /></div>
            <div><Label>Barcode (UPC)</Label><TextInput value={barcode} onChange={(e) => setBarcode(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Purchase (₹)</Label><TextInput type="number" step="0.01" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required /></div>
            <div><Label>Sale (₹)</Label><TextInput type="number" step="0.01" value={sPrice} onChange={(e) => setSPrice(e.target.value)} required /></div>
            <div><Label>Min Stock</Label><TextInput type="number" value={mStock} onChange={(e) => setMStock(e.target.value)} /></div>
          </div>
          <div><Label>Description</Label><TextInput value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          <div className="flex items-center gap-2"><ToggleSwitch checked={isActive} label="Set Active Visibility Status" onChange={setIsActive} disabled={isLoading} /></div>
          <div className="flex justify-end gap-2 pt-3 border-t dark:border-gray-700"><Button color="gray" size="sm" onClick={onClose} disabled={isLoading}>Cancel</Button><Button type="submit" color="blue" size="sm" disabled={isLoading}>{isLoading ? <Spinner size="sm" /> : 'Save Item'}</Button></div>
        </form>
      </ModalBody>
    </Modal>
  );
};
```
# Step 4: Complete Master List View Component (src/features/masters/products/views/ProductListPane.tsx)
```tsx
import React, { useState } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../api/productsApi';
import { ProductFormModal } from './ProductFormModal';
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Spinner, Badge, Pagination, Button, TextInput } from 'flowbite-react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import type { Product } from '../types/productTypes';

export const ProductListPane: React.FC = () => {
  const [page, setPage] = useState(1), [search, setSearch] = useState(''), [isOpen, setIsOpen] = useState(false), [target, setTarget] = useState<Product | null>(null);
  const { data: prods, isLoading } = useGetProductsQuery({ page, search }), [deleteProduct] = useDeleteProductMutation();

  const handleEdit = (p: Product) => { setTarget(p); setIsOpen(true); }, handleDelete = async (id: number) => { if (window.confirm('Delete item?')) await deleteProduct(id); };

  if (isLoading) return <div className="text-center p-10"><Spinner size="lg" color="info" /></div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 dark:border-gray-700">
        <div><h3 className="text-xl font-bold flex items-center gap-2"><Package size={20} className="text-primary-600" /> Product Master Catalogue</h3></div>
        <div className="flex w-full sm:w-auto gap-2">
          <TextInput placeholder="Search SKU, name..." icon={Search as any} value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} size="sm" className="w-full max-w-xs" />
          <Button size="xs" color="blue" className="font-semibold whitespace-nowrap" onClick={() => { setTarget(null); setIsOpen(true); }}><Plus size={14} className="mr-1" /> Add Product</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead><tr><TableHeadCell>SKU / Barcode</TableHeadCell><TableHeadCell>Product Item</TableHeadCell><TableHeadCell>Category/Brand</TableHeadCell><TableHeadCell className="text-right">Purchase Price</TableHeadCell><TableHeadCell className="text-right">Sale Price</TableHeadCell><TableHeadCell>Status</TableHeadCell><TableHeadCell className="text-center">Actions</TableHeadCell></tr></TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {prods?.data.map((p) => (
              <TableRow key={p.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs text-gray-500"><div><Badge color="purple" className="w-fit">{p.sku}</Badge></div><div className="mt-0.5 text-[10px]">{p.barcode || ''}</div></TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">{p.name}</TableCell>
                <TableCell className="text-xs space-y-0.5"><div>{p.category?.name || 'Unassigned'}</div><div className="text-gray-400 font-medium">{p.brand?.name || ''}</div></TableCell>
                <TableCell className="text-right font-mono font-bold text-gray-400">₹{p.purchase_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right font-mono font-black text-gray-900 dark:text-white">₹{p.sale_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell><Badge color={p.is_active ? 'success' : 'failure'} className="w-fit font-bold">{p.is_active ? 'ACTIVE' : 'INACTIVE'}</Badge></TableCell>
                <TableCell className="text-center"><div className="flex justify-center gap-1.5"><button onClick={() => handleEdit(p)} className="p-1 text-blue-600 rounded"><Edit2 size={13} /></button><button onClick={() => handleDelete(p.id)} className="p-1 text-red-600 rounded"><Trash2 size={13} /></button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {prods?.meta && (
        <div className="flex items-center justify-between border-t pt-4"><p className="text-xs text-gray-400">Page {prods.meta.current_page} of {prods.meta.last_page} ({prods.meta.total} listings)</p><Pagination currentPage={page} totalPages={prods.meta.last_page} onPageChange={(p) => setPage(p)} showIcons previousLabel="" nextLabel="" /></div>
      )}
      <ProductFormModal show={isOpen} onClose={() => setIsOpen(false)} editTarget={target} />
    </div>
  );
};
```
# Step 5: Gateway Module Export (src/features/masters/products/index.ts)
```typescript
export { ProductListPane } from './views/ProductListPane';
export { productsApi } from './api/productsApi';
```
# Step 6: Map to the Application Router Tree (src/routes/AppRoutes.tsx)
```tsx
import { ProductListPane } from '@/features/masters/products';

<Route path="/masters/products" element={<ProductListPane />} />
```
# Step 7: Append Sandbox Dataset Fallbacks (src/lib/mockData.ts)
```typescript
if (url.includes('/api/products')) {
  if (method === 'POST' || method === 'PUT') {
    return { id: 501, tenant_id: 1, category_id: 1, unit_id: 1, brand_id: 1, name: data.name, sku: data.sku, barcode: data.barcode, purchase_price: data.purchase_price, sale_price: data.sale_price, minimum_stock: data.minimum_stock, description: data.description, is_active: true };
  }
  return {
    meta: { current_page: 1, last_page: 1, total: 1 },
    data: [
      { id: 1, tenant_id: 1, category_id: 1, unit_id: 1, brand_id: 1, name: "Premium Wireless Optical Mouse", sku: "MS-WRLSS-01", barcode: "890123456789", purchase_price: 450.00, sale_price: 899.00, minimum_stock: 10, description: "Ergonomic 2.4GHz computing accessory", is_active: true, category: { name: "Finished Goods" }, unit: { short_name: "PCS" }, brand: { name: "Logitech Systems" } }
    ]
  };
}
```