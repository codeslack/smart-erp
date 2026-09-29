// src/features/purchase/invoices/views/PurchaseFormItems.tsx
import React from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { Plus, Trash2 } from "lucide-react";

export const PurchaseFormItems: React.FC<{
  items: any[];
  setItems: any;
  products: any[];
  warehouses: any[];
}> = ({ items, setItems, products, warehouses }) => {
  const updateLine = (idx: number, key: string, val: any) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: val };
    setItems(updated);
  };
  return (
    <div className="max-h-[25vh] space-y-3 overflow-y-auto pr-1 font-sans">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase">
          Procurement Items
        </span>
        <Button
          size="xs"
          color="gray"
          onClick={() =>
            setItems([
              ...items,
              { product_id: 0, warehouse_id: 0, quantity: 1, unit_cost: 0 },
            ])
          }
        >
          <Plus size={12} className="mr-1" /> Add Line
        </Button>
      </div>
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/40"
        >
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
              className="absolute top-2 right-2 text-red-500"
            >
              <Trash2 size={13} />
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={item.product_id || ""}
              onChange={(e) =>
                updateLine(idx, "product_id", Number(e.target.value))
              }
              required
              sizing="sm"
            >
              <option value="">Product...</option>
              {products.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select
              value={item.warehouse_id || ""}
              onChange={(e) =>
                updateLine(idx, "warehouse_id", Number(e.target.value))
              }
              required
              sizing="sm"
            >
              <option value="">Warehouse...</option>
              {warehouses.map((w: any) => (
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
              onChange={(e) =>
                updateLine(idx, "quantity", Number(e.target.value))
              }
              sizing="sm"
              required
            />
            <TextInput
              type="number"
              placeholder="Cost (₹)"
              value={item.unit_cost}
              onChange={(e) =>
                updateLine(idx, "unit_cost", parseFloat(e.target.value) || 0)
              }
              sizing="sm"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};
