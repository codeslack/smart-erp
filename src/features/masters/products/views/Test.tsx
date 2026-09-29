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
        
        // FIX: Explicitly include the `uuid` for variants if they already exist
        variants: basePayload.has_variants && Array.isArray(variants) ? variants.map((v: any) => ({
          uuid: v.uuid || null, // Sent to backend so Laravel updates instead of inserting a duplicate!
          name: v.name,
          sku: v.sku,
          barcode: v.barcode || null,
          purchase_price: Number(v.purchase_price || 0),
          selling_price: Number(v.selling_price || 0),
          is_active: v.is_active ?? true,
          attributes: Array.isArray(v.attributes) ? v.attributes.map((a) => ({
            attribute_name: a.attribute_name,
            attribute_value: a.attribute_value
          })) : [],
        })) : [],
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
