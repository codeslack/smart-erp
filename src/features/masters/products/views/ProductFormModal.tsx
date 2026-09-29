// src/features/masters/products/views/ProductFormModal.tsx
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { productFormSchema, type ProductFormValues } from "../utils/productValidation";
import { generateAutoSku } from "../utils/skuGenerator";
import { ProductFormFields } from "./ProductFormFields";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";
import { InventoryTrackingType } from "../types/productTypes";
import {
  useCreateProductMutation,
  useGetProductByUuidQuery,
  useUpdateProductMutation,
  useGetCategoriesLookupQuery,
  useGetBrandsLookupQuery,
  useGetUnitsLookupQuery,
} from "../api/productsApi";

export const ProductFormModal: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const isEdit = !!uuid;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  
  const { data: existingData, isLoading: loadExist, refetch: refetchProduct } = useGetProductByUuidQuery(uuid || "", { skip: !isEdit });
  const { data: catData, isLoading: loadCats, refetch: refetchCats } = useGetCategoriesLookupQuery();
  const { isLoading: loadBrands, refetch: refetchBrands } = useGetBrandsLookupQuery();
  const { isLoading: loadUnits, refetch: refetchUnits } = useGetUnitsLookupQuery();

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      isAutoSku: !isEdit, is_active: true, has_expiry: false, has_warranty: false, has_variants: false,
      purchase_price: "0", selling_price: "0", minimum_stock: "0", maximum_stock: "0", reorder_level: "0", critical_level: "0",
      sku: "", barcode: "", manufacturer: "", model_number: "", part_number: "",
      weight: 0, length: 0, width: 0, height: 0, variants: [],
    },
  });

  const trackingType = watch("inventory_tracking_type");
  const wName = useWatch({ control, name: "name" });
  const wType = useWatch({ control, name: "product_type" });
  const wCatUuid = useWatch({ control, name: "category_uuid" });
  const wAutoSku = useWatch({ control, name: "isAutoSku" });
  const hasVariantsChecked = watch("has_variants");

  useEffect(() => {
    if (trackingType === InventoryTrackingType.NONE) {
      setValue("has_expiry", false); setValue("has_warranty", false); setValue("has_variants", false);
    } else if (trackingType === InventoryTrackingType.BATCH) {
      setValue("has_warranty", false);
    } else if (trackingType === InventoryTrackingType.SERIAL) {
      setValue("has_expiry", false);
    }
  }, [trackingType, setValue]);

  useEffect(() => {
    if (wAutoSku && !hasVariantsChecked && wName && wName.trim().length >= 2) {
      const cats = catData?.data || [];
      const matched = cats.find((c: any) => c.uuid === wCatUuid);
      setValue("sku", generateAutoSku({ name: wName, product_type: wType, category_name: matched?.name }), { shouldValidate: true });
    } else if (hasVariantsChecked) {
      setValue("sku", null);
      setValue("isAutoSku", false);
    }
  }, [wName, wType, wCatUuid, wAutoSku, catData, hasVariantsChecked, setValue]);

  useEffect(() => {
    if (isEdit && !loadExist && !loadCats && !loadBrands && !loadUnits && existingData?.data) {
      const item = existingData.data as any;
      console.log('item', item);
      const parsedItem = {
        ...item,
        purchase_price: String(item.purchase_price ?? "0"),
        selling_price: String(item.selling_price ?? "0"),
        minimum_stock: String(item.minimum_stock ?? "0"),
        maximum_stock: String(item.maximum_stock ?? "0"),
        reorder_level: String(item.reorder_level ?? "0"),
        critical_level: String(item.critical_level ?? "0"),
        category_uuid: item.category?.uuid || item.category_uuid || "",
        brand_uuid: item.brand?.uuid || item.brand_uuid || "",
        unit_uuid: item.unit?.uuid || item.unit_uuid || "",
        isAutoSku: false,
        variants: Array.isArray(item.variants) ? item.variants.map((v: any) => ({
          ...v, purchase_price: String(v.purchase_price ?? "0"), selling_price: String(v.selling_price ?? "0"),
          attributes: Array.isArray(v.attributes) ? v.attributes : [],
        })) : [],
      };
      reset(parsedItem);
    }
  }, [existingData, isEdit, loadExist, loadCats, loadBrands, loadUnits, reset]);

  const handleGlobalRefresh = async () => {
    try {
      setIsRefreshing(true);
      if (isEdit) await refetchProduct();
      await Promise.all([refetchCats(), refetchBrands(), refetchUnits()]);
      dispatch(showToast({ type: "info", message: "Form layouts and dropdowns refreshed successfully." }));
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

    const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      const { isAutoSku, variants, ...basePayload } = values;
      const payload: any = {
        category_uuid: basePayload.category_uuid || null,
        brand_uuid: basePayload.brand_uuid || null,
        unit_uuid: basePayload.unit_uuid || null,
        name: basePayload.name,
        description: basePayload.description || null,
        product_type: basePayload.product_type,
        inventory_tracking_type: basePayload.inventory_tracking_type,
        has_expiry: !!basePayload.has_expiry,
        has_warranty: !!basePayload.has_warranty,
        has_variants: !!basePayload.has_variants,
        purchase_price: Number(basePayload.purchase_price || 0),
        selling_price: Number(basePayload.selling_price || 0),
        minimum_stock: Number(basePayload.minimum_stock || 0),
        maximum_stock: Number(basePayload.maximum_stock || 0),
        reorder_level: Number(basePayload.reorder_level || 0),
        critical_level: Number(basePayload.critical_level || 0),
        manufacturer: basePayload.manufacturer || null,
        model_number: basePayload.model_number || null,
        part_number: basePayload.part_number || null,
        weight: Number(basePayload.weight || 0),
        length: Number(basePayload.length || 0),
        width: Number(basePayload.width || 0),
        height: Number(basePayload.height || 0),
        is_active: basePayload.is_active ?? true,
        sku: basePayload.has_variants ? null : (basePayload.sku || null),
        barcode: basePayload.has_variants ? null : (basePayload.barcode || null),
        
        // FIX: Conditional UUID payload binding to satisfy strict Laravel validation filters
        variants: basePayload.has_variants && Array.isArray(variants) ? variants.map((v: any) => {
          const variantObject: any = {
            name: v.name,
            sku: v.sku,
            barcode: v.barcode || null,
            purchase_price: Number(v.purchase_price || 0),
            selling_price: Number(v.selling_price || 0),
            is_active: v.is_active ?? true,
            attributes: Array.isArray(v.attributes) ? v.attributes.map((a: any) => ({
              attribute_name: a.attribute_name,
              attribute_value: a.attribute_value
            })) : [],
          };

          // Only attach uuid key if it is present and not an empty string or null
          if (v.uuid && v.uuid !== "") {
            variantObject.uuid = v.uuid;
          }

          return variantObject;
        }) : [],
      };

      if (isEdit) {
        await updateProduct({ uuid: uuid!, data: payload }).unwrap();
        dispatch(showToast({ type: "success", message: "Product updated successfully." }));
      } else {
        await createProduct(payload).unwrap();
        dispatch(showToast({ type: "success", message: "Product created successfully." }));
      }
      navigate("/masters/products");
    } catch {
      dispatch(showToast({ type: "failure", message: "Error executing server master record update request." }));
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">{isEdit ? "Modify Product Details" : "Create New Product"}</h2>
        <div className="flex gap-2">
          <Button color="light" size="sm" onClick={() => navigate(-1)}>← Back</Button>
          <Button type="button" color="light" size="sm" onClick={handleGlobalRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "🔄 Refresh"}
          </Button>
        </div>
      </div>
      <ProductFormFields register={register} errors={errors} trackingType={trackingType || ""} watch={watch} control={control} setValue={setValue} />
      <div className="flex justify-end gap-2">
        <Button color="light" onClick={() => navigate("/masters/products")}>Cancel</Button>
        <Button type="submit" color="blue" disabled={isCreating || isUpdating}>{isEdit ? "Apply Variations" : "Publish Master Product"}</Button>
      </div>
    </form>
  );
};
