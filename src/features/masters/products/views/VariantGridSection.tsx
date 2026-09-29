// src/features/masters/products/views/VariantGridSection.tsx
import React from "react";
import { Label, TextInput } from "flowbite-react";
import type { UseFormRegister, FieldErrors, Control, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../utils/productValidation";
import { ProductVariantFields } from "./ProductVariantFields";

interface VariantGridProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  hasVariants: boolean;
}

export const VariantGridSection: React.FC<VariantGridProps> = ({
  control,
  register,
  errors,
  setValue,
  hasVariants,
}) => {
  return (
    <>
      {/* Financials & Stock Controls render only if product does NOT have variants */}
      {!hasVariants && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <fieldset className="grid grid-cols-2 gap-2 rounded border p-4 dark:border-gray-700">
            <legend className="px-2 font-semibold dark:text-white">Financial Pricing</legend>
            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <TextInput
                id="purchase_price"
                type="number"
                step="0.01"
                {...register("purchase_price")}
                color={errors.purchase_price ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{errors.purchase_price?.message}</span>
            </div>
            <div>
              <Label htmlFor="selling_price">Selling Price</Label>
              <TextInput
                id="selling_price"
                type="number"
                step="0.01"
                {...register("selling_price")}
                color={errors.selling_price ? "failure" : undefined}
              />
              <span className="text-xs text-red-500">{errors.selling_price?.message}</span>
            </div>
          </fieldset>

          <fieldset className="grid grid-cols-2 gap-2 rounded border p-4 dark:border-gray-700">
            <legend className="px-2 font-semibold dark:text-white">Stock Control</legend>
            <div>
              <Label htmlFor="minimum_stock">Min Stock</Label>
              <TextInput id="minimum_stock" type="number" {...register("minimum_stock")} />
            </div>
            <div>
              <Label htmlFor="maximum_stock">Max Stock</Label>
              <TextInput id="maximum_stock" type="number" {...register("maximum_stock")} />
            </div>
            <div>
              <Label htmlFor="reorder_level">Reorder Level</Label>
              <TextInput id="reorder_level" type="number" {...register("reorder_level")} />
            </div>
            <div>
              <Label htmlFor="critical_level">Critical Level</Label>
              <TextInput id="critical_level" type="number" {...register("critical_level")} />
            </div>
          </fieldset>
        </div>
      )}

      {/* Render dynamic infinite variant matrix if variants checkbox is checked */}
      {hasVariants && (
        <ProductVariantFields 
          control={control} 
          register={register} 
          errors={errors} 
          setValue={setValue} 
        />
      )}
    </>
  );
};
