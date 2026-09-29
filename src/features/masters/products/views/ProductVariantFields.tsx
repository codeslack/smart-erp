// src/features/masters/products/views/ProductVariantFields.tsx
import React from "react";
import { useFieldArray } from "react-hook-form";
import type { Control, UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Button, Label, TextInput } from "flowbite-react";
import type { ProductFormValues } from "../utils/productValidation";
import { VariantAttributeSubForm } from "./VariantAttributeSubSection";
import { Trash2, Plus } from "lucide-react";

interface VariantFieldsProps {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
}

export const ProductVariantFields: React.FC<VariantFieldsProps> = ({
  control, register, errors,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  return (
    <fieldset className="space-y-4 rounded border p-4 dark:border-gray-700">
      <legend className="px-2 font-semibold dark:text-white">Variant Matrix Combinations</legend>
      
      {fields.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4 text-center border-2 border-dashed border-gray-100 rounded-lg dark:border-gray-700">
          No variants added yet. Click the button below to add configuration sets.
        </p>
      ) : (
        fields.map((field, idx) => (
          <div key={field.id} className="space-y-4 rounded border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <Label className="text-xs">Variant Label *</Label>
                <TextInput sizing="sm" {...register(`variants.${idx}.name`)} placeholder="e.g. 8GB 3200MHz" color={errors.variants?.[idx]?.name ? "failure" : undefined} />
              </div>
              <div>
                <Label className="text-xs">Variant SKU *</Label>
                <TextInput sizing="sm" {...register(`variants.${idx}.sku`)} placeholder="e.g. COR-8-3200" color={errors.variants?.[idx]?.sku ? "failure" : undefined} />
              </div>
              <div>
                <Label className="text-xs">Variant Barcode</Label>
                <TextInput sizing="sm" {...register(`variants.${idx}.barcode`)} placeholder="e.g. 890100000001" />
              </div>
              <div>
                <Label className="text-xs">Purchase Price (₹) *</Label>
                <TextInput sizing="sm" type="number" step="0.01" {...register(`variants.${idx}.purchase_price`)} />
              </div>
              <div>
                <Label className="text-xs">Selling Price (₹) *</Label>
                <TextInput sizing="sm" type="number" step="0.01" {...register(`variants.${idx}.selling_price`)} />
              </div>
            </div>
            
            <VariantAttributeSubForm variantIndex={idx} control={control} register={register} />

            <div className="flex justify-end border-t pt-2 border-gray-100 dark:border-gray-700">
              <button 
                type="button"
                onClick={() => remove(idx)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Variation Row
              </button>
            </div>
          </div>
        ))
      )}
      
      <Button type="button" color="light" size="sm" className="mt-2" onClick={() => append({
        name: "", sku: "", barcode: "", purchase_price: "0", selling_price: "0", is_active: true,
        attributes: [], // Reverted back to pristine empty configuration state array on append
      })}>
        <Plus className="mr-1 h-4 w-4" /> Add Dynamic Product Variant
      </Button>
    </fieldset>
  );
};
