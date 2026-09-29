// src/features/masters/products/utils/skuGenerator.ts
import { ProductType } from "../types/productTypes";

interface SkuGenerationInputs {
  name?: string;
  product_type?: string;
  category_name?: string;
}

export function generateAutoSku({ name, product_type, category_name }: SkuGenerationInputs): string {
  const extract = (text: string | undefined, len: number, pad: string): string => {
    if (!text) return pad.repeat(len);
    return text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, len).padEnd(len, pad);
  };

  const typeMap: Record<string, string> = {
    [ProductType.PRODUCT]: "PRD",
    [ProductType.SERVICE]: "SRV",
    [ProductType.RAW_MATERIAL]: "RMT",
    [ProductType.FINISHED_GOOD]: "FGD",
    [ProductType.CONSUMABLE]: "CNS",
  };

  const typePrefix = typeMap[product_type || ""] || "GEN";
  const catPrefix = category_name ? extract(category_name, 3, "X") : "GEN";
  const namePrefix = extract(name, 4, "P");
  const randSuffix = Date.now().toString(36).slice(-4).toUpperCase();

  return `${typePrefix}-${catPrefix}-${namePrefix}-${randSuffix}`;
}

export function generateVariantSku(parentSku: string, attributes: any[], idx: number): string {
  const attrSeg = attributes
    .map((a) => (a.attribute_value || "").replace(/[^a-zA-Z0-9]/g, "").substring(0, 3).toUpperCase())
    .filter(Boolean)
    .join("-");
  const seq = String(idx + 1).padStart(2, "0");
  return attrSeg ? `${parentSku}-${attrSeg}-${seq}` : `${parentSku}-VAR-${seq}`;
}
