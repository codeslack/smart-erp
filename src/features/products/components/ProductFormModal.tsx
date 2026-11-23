import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Checkbox,
} from 'flowbite-react';
import { Loader2 } from 'lucide-react';
import { productSchema } from '../productValidation';
import type { ProductFormData } from '../productValidation';
import { productService } from '../productService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { Product, CreateProductRequest, Category, Brand, Unit } from '@/types/product';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const isEditing = Boolean(product?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      product_type: 'PRODUCT',
      inventory_tracking_type: 'NONE',
      category_uuid: '',
      brand_uuid: '',
      unit_uuid: '',
      purchase_price: 0,
      selling_price: 0,
      minimum_stock: 0,
      reorder_level: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setServerErrors({});
      // Load dropdown options
      Promise.allSettled([
        productService.getCategories(),
        productService.getBrands(),
        productService.getUnits(),
      ]).then(([catRes, brandRes, unitRes]) => {
        if (catRes.status === 'fulfilled') setCategories(catRes.value);
        if (brandRes.status === 'fulfilled') setBrands(brandRes.value);
        if (unitRes.status === 'fulfilled') setUnits(unitRes.value);
      });

      if (product) {
        reset({
          name: product.name || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          description: product.description || '',
          product_type: product.product_type || 'PRODUCT',
          inventory_tracking_type: product.inventory_tracking_type || 'NONE',
          category_uuid: product.category_uuid || product.category?.uuid || '',
          brand_uuid: product.brand_uuid || product.brand?.uuid || '',
          unit_uuid: product.unit_uuid || product.unit?.uuid || '',
          purchase_price: product.purchase_price ?? 0,
          selling_price: product.selling_price ?? 0,
          minimum_stock: product.minimum_stock ?? 0,
          reorder_level: product.reorder_level ?? 0,
          is_active: product.is_active ?? true,
        });
      } else {
        reset({
          name: '',
          sku: '',
          barcode: '',
          description: '',
          product_type: 'PRODUCT',
          inventory_tracking_type: 'NONE',
          category_uuid: '',
          brand_uuid: '',
          unit_uuid: '',
          purchase_price: 0,
          selling_price: 0,
          minimum_stock: 0,
          reorder_level: 0,
          is_active: true,
        });
      }
    }
  }, [isOpen, product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: CreateProductRequest = {
        name: data.name.trim(),
        sku: data.sku?.trim() || null,
        barcode: data.barcode?.trim() || null,
        description: data.description?.trim() || null,
        product_type: data.product_type,
        inventory_tracking_type: data.inventory_tracking_type,
        category_uuid: data.category_uuid || null,
        brand_uuid: data.brand_uuid || null,
        unit_uuid: data.unit_uuid || null,
        purchase_price: data.purchase_price !== null && data.purchase_price !== undefined ? Number(data.purchase_price) : null,
        selling_price: data.selling_price !== null && data.selling_price !== undefined ? Number(data.selling_price) : null,
        minimum_stock: data.minimum_stock !== null && data.minimum_stock !== undefined ? Number(data.minimum_stock) : null,
        reorder_level: data.reorder_level !== null && data.reorder_level !== undefined ? Number(data.reorder_level) : null,
        is_active: data.is_active,
      };

      if (isEditing && product?.uuid) {
        await productService.updateProduct(product.uuid, payload);
        dispatch(
          addToast({
            title: 'Product Updated',
            message: `Product ${data.name} was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await productService.createProduct(payload);
        dispatch(
          addToast({
            title: 'Product Created',
            message: `Product ${data.name} was successfully created.`,
            type: 'success',
          })
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const fieldErrors = extractValidationErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setServerErrors(fieldErrors);
      } else {
        dispatch(
          addToast({
            title: 'Operation Failed',
            message: getErrorMessage(err),
            type: 'error',
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="3xl">
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="prod-name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="prod-name"
                placeholder="e.g. Wireless Ergonomic Mouse"
                className="mt-1"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
              {serverErrors.name && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.name[0]}</p>
              )}
            </div>

            {/* SKU */}
            <div>
              <Label htmlFor="prod-sku">SKU Code</Label>
              <TextInput
                id="prod-sku"
                placeholder="e.g. MS-WRLSS-01"
                className="mt-1 font-mono"
                {...register('sku')}
              />
              {errors.sku && (
                <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>
              )}
              {serverErrors.sku && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.sku[0]}</p>
              )}
            </div>

            {/* Barcode */}
            <div>
              <Label htmlFor="prod-barcode">Barcode</Label>
              <TextInput
                id="prod-barcode"
                placeholder="e.g. 890123456789"
                className="mt-1 font-mono"
                {...register('barcode')}
              />
              {errors.barcode && (
                <p className="mt-1 text-xs text-red-600">{errors.barcode.message}</p>
              )}
              {serverErrors.barcode && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.barcode[0]}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="prod-cat">Category</Label>
              <Select id="prod-cat" className="mt-1" {...register('category_uuid')}>
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="prod-brand">Brand</Label>
              <Select id="prod-brand" className="mt-1" {...register('brand_uuid')}>
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.uuid} value={b.uuid}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Unit */}
            <div>
              <Label htmlFor="prod-unit">Unit of Measure</Label>
              <Select id="prod-unit" className="mt-1" {...register('unit_uuid')}>
                <option value="">Select Unit</option>
                {units.map((u) => (
                  <option key={u.uuid} value={u.uuid}>
                    {u.name} ({u.short_name})
                  </option>
                ))}
              </Select>
            </div>

            {/* Product Type */}
            <div>
              <Label htmlFor="prod-type">Product Type</Label>
              <Select id="prod-type" className="mt-1" {...register('product_type')}>
                <option value="PRODUCT">Standard Product</option>
                <option value="SERVICE">Service Item</option>
                <option value="RAW_MATERIAL">Raw Material</option>
                <option value="FINISHED_GOOD">Finished Good</option>
                <option value="CONSUMABLE">Consumable Item</option>
              </Select>
            </div>

            {/* Pricing */}
            <div>
              <Label htmlFor="prod-purchase">Purchase Price ($)</Label>
              <TextInput
                id="prod-purchase"
                type="number"
                step="any"
                min={0}
                className="mt-1"
                {...register('purchase_price', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="prod-selling">Selling Price ($)</Label>
              <TextInput
                id="prod-selling"
                type="number"
                step="any"
                min={0}
                className="mt-1"
                {...register('selling_price', { valueAsNumber: true })}
              />
            </div>

            {/* Stock Levels */}
            <div>
              <Label htmlFor="prod-min-stock">Minimum Stock Alert</Label>
              <TextInput
                id="prod-min-stock"
                type="number"
                min={0}
                className="mt-1"
                {...register('minimum_stock', { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label htmlFor="prod-reorder">Reorder Threshold</Label>
              <TextInput
                id="prod-reorder"
                type="number"
                min={0}
                className="mt-1"
                {...register('reorder_level', { valueAsNumber: true })}
              />
            </div>

            {/* Tracking Type */}
            <div>
              <Label htmlFor="prod-tracking">Inventory Tracking</Label>
              <Select id="prod-tracking" className="mt-1" {...register('inventory_tracking_type')}>
                <option value="NONE">Standard Quantity Only</option>
                <option value="BATCH">Batch Tracking</option>
                <option value="SERIAL">Serial Number Tracking</option>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="prod-active" {...register('is_active')} />
              <Label htmlFor="prod-active" className="cursor-pointer">
                Product is Active
              </Label>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                placeholder="Product specifications and details"
                rows={2}
                className="mt-1"
                {...register('description')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button color="gray" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
