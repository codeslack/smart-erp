// src/features/purchase/orders/views/OrderFormModal.tsx
import React, { useState } from "react";
import { useGetSuppliersQuery } from "../../../masters/suppliers/api/suppliersApi";
import { useGetProductsQuery } from "../../../masters/products/api/productsApi";
import { useGetWarehousesQuery } from "../../../masters/warehouses/api/warehousesApi"; // Loaded warehouses hooks
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { ShoppingBag, Plus, Trash2 } from "lucide-react";
import { useCreatePurchaseOrderMutation } from "../../api";

export const OrderFormModal: React.FC<{
  show: boolean;
  onClose: () => void;
}> = ({ show, onClose }) => {
  const [suppId, setSuppId] = useState(""),
    [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  // FIXED: Added warehouse_id state placeholder object inside initial list mapping states
  const [items, setItems] = useState<any[]>([
    { product_id: 0, warehouse_id: 0, quantity: 1, estimated_cost: 0 },
  ]);

  const { data: suppliers } = useGetSuppliersQuery({ page: 1, search: "" });
  const { data: prods } = useGetProductsQuery({ page: 1, search: "" });
  const { data: whs } = useGetWarehousesQuery({ page: 1, search: "" } as any);
  const [createOrder, { isLoading }] = useCreatePurchaseOrderMutation();

  const totalCalculated = items.reduce(
    (acc, curr) => acc + curr.quantity * curr.estimated_cost,
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formattedMysqlDate = new Date(date).toISOString().split('T')[0];

      await createOrder({
        supplier_id: Number(suppId),
        // FIXED: Renamed payload parameter key to match Laravel "order_date" requirement exactly
        order_date: formattedMysqlDate,
        items: items.map((i) => ({
          product_id: Number(i.product_id),
          // FIXED: Injected warehouse_id state map into submission loop payload array
          warehouse_id: Number(i.warehouse_id),
          quantity: Number(i.quantity),
          unit_cost: Number(i.estimated_cost),
        })),
      } as any).unwrap();
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4">
        <span className="flex items-center gap-2 text-lg font-bold">
          <ShoppingBag className="text-primary-600" /> Draft Purchase Order
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <Label>Select Supplier</Label>
            <Select
              value={suppId}
              onChange={(e) => setSuppId(e.target.value)}
              required
            >
              <option value="">Select...</option>
              {suppliers?.data.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Order Request Date</Label>
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="max-h-[25vh] space-y-2 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="relative space-y-1 rounded-lg border bg-gray-50 p-2 dark:bg-gray-700/40"
              >
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={item.product_id || ""}
                    onChange={(e) => {
                      const u = [...items];
                      u[idx].product_id = Number(e.target.value);
                      setItems(u);
                    }}
                    required
                    sizing="sm"
                  >
                    <option value="">Product...</option>
                    {prods?.data.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                  {/* FIXED: Added a selector field to allow accountants to pick target stock warehouses */}
                  <Select
                    value={item.warehouse_id || ""}
                    onChange={(e) => {
                      const u = [...items];
                      u[idx].warehouse_id = Number(e.target.value);
                      setItems(u);
                    }}
                    required
                    sizing="sm"
                  >
                    <option value="">Warehouse...</option>
                    {whs?.data.map((w: any) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => {
                      const u = [...items];
                      u[idx].quantity = Number(e.target.value);
                      setItems(u);
                    }}
                    sizing="sm"
                    required
                  />
                  <TextInput
                    type="number"
                    placeholder="Cost"
                    value={item.estimated_cost}
                    onChange={(e) => {
                      const u = [...items];
                      u[idx].estimated_cost = parseFloat(e.target.value) || 0;
                      setItems(u);
                    }}
                    sizing="sm"
                    required
                  />
                </div>
              </div>
            ))}
            <Button
              size="xs"
              color="gray"
              className="mt-1 w-full"
              onClick={() =>
                setItems([
                  ...items,
                  {
                    product_id: 0,
                    warehouse_id: 0,
                    quantity: 1,
                    estimated_cost: 0,
                  },
                ])
              }
            >
              <Plus size={12} className="mr-1" /> Add Item Line
            </Button>
          </div>
          <div className="flex justify-between rounded border bg-gray-50 p-2 font-mono text-xs font-bold">
            <span>Est Total:</span>
            <span>
              ₹
              {totalCalculated.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex gap-2 border-t pt-3 dark:border-gray-700">
            <Button
              color="gray"
              size="sm"
              className="w-full"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Spinner size="sm" /> : "Save Order"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
