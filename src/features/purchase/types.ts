// src/features/purchase/types.ts

export interface PurchaseLineItem {
  id?: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  unit_cost: number;
  product_name?: string;
  warehouse_name?: string;
}

export interface PurchaseInvoice {
  id: number;
  tenant_id: number;
  supplier_id: number;
  purchase_date: string;
  notes: string | null;
  purchase_no: string;
  total_amount: string; // Decimal returned as string from Laravel
  status: 'draft' | 'approved';
  supplier_name?: string;
  items: PurchaseLineItem[];
}

export interface PurchaseOrder {
  id: number;
  order_no: string;
  supplier_id: number;
  supplier_name: string;
  date: string;
  total: string;
  status: 'draft' | 'approved';
}

export interface GoodsReceiptNote {
  id: number;
  grn_no: string;
  purchase_order_no: string;
  supplier_name: string;
  warehouse_name: string;
  receive_date: string;
  status: 'pending' | 'received' | 'partially_received';
  total_items_received: number;
}

export interface PurchaseReturn {
  id: number;
  return_no: string;
  purchase_invoice_no: string;
  supplier_name: string;
  date: string;
  total: string;
  status: 'draft' | 'completed';
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: LaravelPaginationMeta;
}
