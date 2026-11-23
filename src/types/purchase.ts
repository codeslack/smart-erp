export type PurchaseOrderStatus =
  | 'draft'
  | 'confirmed'
  | 'partially_received'
  | 'received'
  | 'billed'
  | 'completed'
  | 'cancelled';

export type PurchaseStatus =
  | 'draft'
  | 'confirmed'
  | 'paid'
  | 'partially_paid'
  | 'cancelled';

export type PurchaseReturnStatus =
  | 'draft'
  | 'approved'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface PurchaseOrderItem {
  uuid?: string;
  product_uuid?: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  tax_amount?: number;
  total_amount: number;
}

export interface PurchaseOrder {
  uuid: string;
  order_number: string;
  order_date: string;
  order_date_formatted?: string;
  expected_delivery_date?: string | null;
  expected_delivery_date_formatted?: string | null;
  status: PurchaseOrderStatus;
  status_label?: string;
  supplier?: { uuid: string; name: string; code?: string };
  warehouse?: { uuid: string; name: string };
  payment_term?: { uuid: string; name: string };
  amounts?: {
    subtotal: number;
    discount: number;
    additional_charge: number;
    tax_total: number;
    rounding_adjustment: number;
    grand_total: number;
  };
  notes?: string | null;
  confirmed_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseInvoice {
  uuid: string;
  purchase_no: string;
  supplier_invoice_number?: string | null;
  supplier_invoice_date?: string | null;
  purchase_date: string;
  purchase_date_formatted?: string;
  due_date?: string | null;
  due_date_formatted?: string | null;
  status: PurchaseStatus;
  status_label?: string;
  supplier?: { uuid: string; name: string; code?: string; email?: string; phone?: string };
  warehouse?: { uuid: string; name: string; code?: string };
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  returned_amount: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseReturn {
  uuid: string;
  return_no: string;
  purchase_uuid?: string;
  return_date: string;
  return_date_formatted?: string;
  status: PurchaseReturnStatus;
  status_label?: string;
  subtotal: number;
  tax_amount: number;
  grand_total: number;
  refund_amount: number;
  credited_amount: number;
  return_reason?: string | null;
  notes?: string | null;
  supplier?: { uuid: string; name: string; code?: string };
  created_at: string;
  updated_at: string;
}

export interface PurchaseQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  supplier_uuid?: string;
  order_number?: string;
  purchase_no?: string;
  return_no?: string;
  search?: string;
}
