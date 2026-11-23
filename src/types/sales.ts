export type SaleStatus =
  | 'draft'
  | 'confirmed'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type SalesOrderStatus =
  | 'draft'
  | 'confirmed'
  | 'processing'
  | 'completed'
  | 'cancelled';

export type SalesQuotationStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'converted_to_order'
  | 'converted_to_sale'
  | 'expired'
  | 'cancelled';

export interface SaleItem {
  uuid?: string;
  product_uuid?: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  discount_amount?: number;
  tax_amount?: number;
  total_amount: number;
}

export interface Sale {
  uuid: string;
  sale_no: string;
  sale_date: string;
  sale_date_formatted?: string;
  due_date?: string | null;
  due_date_formatted?: string | null;
  customer_reference_number?: string | null;
  status: SaleStatus;
  status_label?: string;
  customer?: { uuid: string; name: string; code: string };
  warehouse?: { uuid: string; name: string };
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  paid_amount: number;
  due_amount: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesOrder {
  uuid: string;
  order_number: string;
  order_date: string;
  order_date_formatted?: string;
  expected_delivery_date?: string | null;
  expected_delivery_date_formatted?: string | null;
  status: SalesOrderStatus;
  status_label?: string;
  customer?: { uuid: string; name: string; code: string };
  warehouse?: { uuid: string; name: string };
  subtotal?: number;
  grand_total: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesQuotation {
  uuid: string;
  quotation_no: string;
  quotation_date: string;
  quotation_date_formatted?: string;
  expiry_date?: string | null;
  expiry_date_formatted?: string | null;
  status: SalesQuotationStatus;
  status_label?: string;
  customer?: { uuid: string; name: string; code: string };
  grand_total: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
  customer_uuid?: string;
  sale_no?: string;
  order_number?: string;
  quotation_no?: string;
}
