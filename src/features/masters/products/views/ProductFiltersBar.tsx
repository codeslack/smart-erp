// src/features/masters/products/views/ProductFiltersBar.tsx
import React from "react";
import { TextInput, Select, Button } from "flowbite-react";
import { ProductType } from "../types/productTypes";
import type { ProductFilters } from "../types/productTypes";
import {
  useGetCategoriesLookupQuery,
  useGetBrandsLookupQuery,
} from "../api/productsApi";

interface FiltersBarProps {
  filters: ProductFilters;
  onChange: (newFilters: ProductFilters) => void;
}

export const ProductFiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChange,
}) => {
  const { data: catData } = useGetCategoriesLookupQuery();
  const { data: brandData } = useGetBrandsLookupQuery();

  const handleFieldChange = (key: keyof ProductFilters, value: string) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-4 dark:bg-gray-900/40">
      <div>
        <TextInput
          placeholder="Search name, SKU, barcode..."
          value={filters.search || ""}
          onChange={(e) => handleFieldChange("search", e.target.value)}
        />
      </div>

      <div>
        <Select
          value={filters.product_type || ""}
          onChange={(e) => handleFieldChange("product_type", e.target.value)}
        >
          <option value="">All Product Types</option>
          {Object.values(ProductType).map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Select
          value={filters.category_uuid || ""}
          onChange={(e) => handleFieldChange("category_uuid", e.target.value)}
        >
          <option value="">All Categories</option>
          {(catData?.data || []).map((c: any) => (
            <option key={c.uuid} value={c.uuid}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Select
          value={filters.is_active || ""}
          onChange={(e) => handleFieldChange("is_active", e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </Select>
      </div>
    </div>
  );
};
