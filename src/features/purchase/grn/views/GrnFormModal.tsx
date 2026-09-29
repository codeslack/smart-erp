// src/features/purchase/grn/views/GrnFormModal.tsx
import React, { useState } from "react";
import {
  useGetPurchaseOrdersQuery,
  useCreateGRNMutation,
} from "../../api"; // FIXED: Imported custom hook
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
import { ClipboardCheck } from "lucide-react";
import { useGetWarehousesQuery } from "@/features/masters/warehouses/api/warehousesApi";

export const GrnFormModal: React.FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  const [poNo, setPoNo] = useState(""),
    [whId, setWhId] = useState(""),
    [date, setDate] = useState(new Date().toISOString().split("T")[0]),
    [qty, setQty] = useState("0");
  const { data: orders } = useGetPurchaseOrdersQuery({ page: 1 });
  const { data: whs } = useGetWarehousesQuery({ page: 1, search: "" } as any);

  // FIXED: Clean, Redux-native mutation hook replacement
  const [createGrn, { isLoading }] = useCreateGRNMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGrn({
        purchase_order_no: poNo,
        warehouse_id: Number(whId),
        receive_date: new Date(date).toISOString(),
        total_items_received: Number(qty),
      } as any).unwrap();
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <ClipboardCheck className="text-primary-600" /> Issue Goods Receipt
          Note
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <Label>Source Purchase Order Reference</Label>
            <Select
              value={poNo}
              onChange={(e) => setPoNo(e.target.value)}
              required
            >
              <option value="">Select PO...</option>
              {orders?.data.map((o: any) => (
                <option key={o.id} value={o.order_no}>
                  #{o.order_no} - {o.supplier_name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Target Receiving Warehouse</Label>
            <Select
              value={whId}
              onChange={(e) => setWhId(e.target.value)}
              required
            >
              <option value="">Select Hub...</option>
              {whs?.data.map((w: any) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Receipt Allocation Count (Qty)</Label>
            <TextInput
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Receive Tracking Date</Label>
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
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
              {isLoading ? <Spinner size="sm" /> : "Log Stock Receipt"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
