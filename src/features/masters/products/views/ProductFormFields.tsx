// src/features/masters/products/views/ProductFormFields.tsx
import React from "react";
import type { UseFormRegister, FieldErrors, UseFormWatch, Control, UseFormSetValue } from "react-hook-form";
import { Label, TextInput, Select, Textarea } from "flowbite-react";
import type { ProductFormValues } from "../utils/productValidation";
import { ProductType, InventoryTrackingType } from "../types/productTypes";
import { VariantGridSection } from "./VariantGridSection";
import {
  useGetCategoriesLookupQuery,
  useGetBrandsLookupQuery,
  useGetUnitsLookupQuery,
} from "../api/productsApi";

interface FieldsProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  trackingType: string;
  watch: UseFormWatch<ProductFormValues>;
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export const ProductFormFields: React.FC<FieldsProps> = ({
  register, errors, trackingType, watch, control, setValue,
}) => {
  const { data: catData, isLoading: loadCats } = useGetCategoriesLookupQuery();
  const { data: brandData, isLoading: loadBrands } = useGetBrandsLookupQuery();
  const { data: unitData, isLoading: loadUnits } = useGetUnitsLookupQuery();

  const categories = catData?.data || [];
  const brands = brandData?.data || [];
  const units = unitData?.data || [];

  const isAutoSkuChecked = watch("isAutoSku");
  const hasVariantsEnabled = watch("has_variants");

  return (
    <>
      {/* 1. Basic Information Block */}
      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 md:grid-cols-2 dark:border-gray-700">
        <legend className="px-2 font-semibold dark:text-white">Basic Information</legend>
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <TextInput id="name" {...register("name")} color={errors.name ? "failure" : undefined} />
          <span className="text-xs text-red-500">{errors.name?.message}</span>
        </div>
        
        {!hasVariantsEnabled && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="sku">SKU *</Label>
              <label className="inline-flex items-center text-xs text-cyan-600 dark:text-cyan-400 cursor-pointer">
                <input type="checkbox" {...register("isAutoSku")} className="mr-1.5 h-3.5 w-3.5 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                Auto-generate
              </label>
            </div>
            <TextInput id="sku" {...register("sku")} disabled={isAutoSkuChecked} className={isAutoSkuChecked ? "opacity-75 cursor-not-allowed" : ""} color={errors.sku ? "failure" : undefined} />
            <span className="text-xs text-red-500">{errors.sku?.message}</span>
          </div>
        )}
        
        {!hasVariantsEnabled && (
          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <TextInput id="barcode" {...register("barcode")} />
          </div>
        )}
        
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} rows={2} />
        </div>
      </fieldset>

      {/* 2. Logistic Dimensions Block */}
      <fieldset className="grid grid-cols-2 gap-4 rounded border p-4 md:grid-cols-4 dark:border-gray-700">
        <legend className="px-2 font-semibold dark:text-white">Logistic Logistics & Dimensions</legend>
        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <TextInput id="manufacturer" {...register("manufacturer")} placeholder="e.g. Intel" />
        </div>
        <div>
          <Label htmlFor="model_number">Model Number</Label>
          <TextInput id="model_number" {...register("model_number")} />
        </div>
        <div>
          <Label htmlFor="part_number">Part Number</Label>
          <TextInput id="part_number" {...register("part_number")} />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <TextInput id="weight" type="number" step="0.001" {...register("weight")} />
        </div>
        <div>
          <Label htmlFor="length">Length (cm)</Label>
          <TextInput id="length" type="number" {...register("length")} />
        </div>
        <div>
          <Label htmlFor="width">Width (cm)</Label>
          <TextInput id="width" type="number" {...register("width")} />
        </div>
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <TextInput id="height" type="number" {...register("height")} />
        </div>
      </fieldset>

      {/* 3. Relationships & Lookups */}
      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 md:grid-cols-3 dark:border-gray-700">
        <legend className="px-2 font-semibold dark:text-white">Relationships & Lookups</legend>
        <div>
          <Label htmlFor="category_uuid">Category</Label>
          <Select id="category_uuid" {...register("category_uuid")} color={errors.category_uuid ? "failure" : undefined}>
            <option value="">{loadCats ? "Loading..." : "Select Category"}</option>
            {categories.map((c: any) => <option key={c.uuid} value={c.uuid}>{c.name}</option>)}
          </Select>
          <span className="text-xs text-red-500">{errors.category_uuid?.message}</span>
        </div>
        <div>
          <Label htmlFor="brand_uuid">Brand</Label>
          <Select id="brand_uuid" {...register("brand_uuid")} color={errors.brand_uuid ? "failure" : undefined}>
            <option value="">{loadBrands ? "Loading..." : "Select Brand"}</option>
            {brands.map((b: any) => <option key={b.uuid} value={b.uuid}>{b.name}</option>)}
          </Select>
          <span className="text-xs text-red-500">{errors.brand_uuid?.message}</span>
        </div>
        <div>
          <Label htmlFor="unit_uuid">Unit</Label>
          <Select id="unit_uuid" {...register("unit_uuid")} color={errors.unit_uuid ? "failure" : undefined}>
            <option value="">{loadUnits ? "Loading..." : "Select Unit"}</option>
            {units.map((u: any) => <option key={u.uuid} value={u.uuid}>{u.name}</option>)}
          </Select>
          <span className="text-xs text-red-500">{errors.unit_uuid?.message}</span>
        </div>
      </fieldset>
      
      {/* 4. Product Classification & Rules */}
      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 md:grid-cols-2 dark:border-gray-700">
        <legend className="px-2 font-semibold dark:text-white">Product Classification & Rules</legend>
        <div>
          <Label htmlFor="product_type">Product Type *</Label>
          <Select id="product_type" {...register("product_type")} color={errors.product_type ? "failure" : undefined}>
            <option value="">Select Type</option>
            {Object.values(ProductType).map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <span className="text-xs text-red-500">{errors.product_type?.message}</span>
        </div>
        <div>
          <Label htmlFor="inventory_tracking_type">Inventory Tracking Type *</Label>
          <Select id="inventory_tracking_type" {...register("inventory_tracking_type")} color={errors.inventory_tracking_type ? "failure" : undefined}>
            <option value="">Select Track Mechanism</option>
            {Object.values(InventoryTrackingType).map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <span className="text-xs text-red-500">{errors.inventory_tracking_type?.message}</span>
        </div>
        <div className="flex flex-col gap-2 pt-4 md:col-span-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("has_expiry")} disabled={trackingType === InventoryTrackingType.NONE || trackingType === InventoryTrackingType.SERIAL} className="rounded border-gray-300 text-cyan-600" />
            <span className="text-sm dark:text-white">Has Expiry Tracking</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("has_warranty")} disabled={trackingType === InventoryTrackingType.NONE || trackingType === InventoryTrackingType.BATCH} className="rounded border-gray-300 text-cyan-600" />
            <span className="text-sm dark:text-white">Has Warranty Tracking</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("has_variants")} disabled={trackingType === InventoryTrackingType.NONE} className="rounded border-gray-300 text-cyan-600" />
            <span className="text-sm dark:text-white">Has Variant Matrix Combinations</span>
          </label>
        </div>
      </fieldset>
      
      <VariantGridSection control={control} register={register} errors={errors} setValue={setValue} hasVariants={!!hasVariantsEnabled} />
    </>
  );
};
