// src/features/masters/products/views/VariantAttributeSubSection.tsx
import React from "react";
import { useFieldArray } from "react-hook-form";
import type { Control, UseFormRegister } from "react-hook-form";
import { Button, Label, TextInput } from "flowbite-react";
import type { ProductFormValues } from "../utils/productValidation";
import { Plus, X, Layers } from "lucide-react";

interface AttributeSubFormProps {
  variantIndex: number;
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}

export const VariantAttributeSubForm: React.FC<AttributeSubFormProps> = ({
  variantIndex,
  control,
  register,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${variantIndex}.attributes` as any,
  });

  return (
    <div className="border-t pt-3 border-gray-100 dark:border-gray-700 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Specification Attributes Matrix
        </span>
        <Button 
          type="button" 
          color="gray" 
          size="xs" 
          pill 
          onClick={() => append({ attribute_name: "", attribute_value: "" })}
        >
          <Plus className="h-3 w-3 mr-1" /> Add Spec Attribute
        </Button>
      </div>

      {/* Aligned Empty State Container matching your product list fallback style */}
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 px-2 border-2 border-dashed border-gray-200 rounded-lg dark:border-gray-700 bg-white/50 dark:bg-gray-800/20">
          <Layers className="h-5 w-5 text-gray-400 mb-1" />
          <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center">
            No specification attributes added to this variant yet. Click "Add Spec Attribute" above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fields.map((field, attrIdx) => (
            <div key={field.id} className="flex items-end gap-1 bg-white p-2 rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700 shadow-sm">
              <div className="flex-1">
                <Label className="text-[10px] text-gray-400">Spec Name</Label>
                <TextInput sizing="sm" {...register(`variants.${variantIndex}.attributes.${attrIdx}.attribute_name` as any)} placeholder="e.g. Color, Speed" />
              </div>
              <div className="flex-1">
                <Label className="text-[10px] text-gray-400">Value</Label>
                <TextInput sizing="sm" {...register(`variants.${variantIndex}.attributes.${attrIdx}.attribute_value` as any)} placeholder="e.g. Blue, 3200MHz" />
              </div>
              <Button 
                type="button" 
                color="light" 
                size="sm" 
                className="p-2 flex items-center justify-center border-gray-200 focus:ring-1" 
                onClick={() => remove(attrIdx)}
              >
                <X className="h-3.5 w-3.5 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
