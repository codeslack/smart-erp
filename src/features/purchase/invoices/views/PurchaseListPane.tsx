// src/features/purchase/invoices/views/PurchaseListPane.tsx
import React, { useState } from "react";
import { useGetPurchasesQuery } from "../api/invoicesApi";
import { PurchaseFormModal } from "./PurchaseFormModal";
import { useAppDispatch } from "@/store/hooks";
import { openConfirmDialog } from "@/store/confirmSlice";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Badge,
  Pagination,
  Button,
} from "flowbite-react";
import { Calendar, Hash, CheckCircle, Trash2, Plus } from "lucide-react";

export const PurchaseListPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1),
    [isOpen, setIsOpen] = useState(false);
  const { data: purchases, isLoading } = useGetPurchasesQuery({
    page,
    search: "",
  });

  const handleAction = (
    id: number,
    actionType: "post" | "delete",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const config = {
      post: {
        title: "Approve Bill",
        message: "Officially authorize this purchase invoice?",
      },
      delete: {
        title: "Purge Record",
        message: "Delete this purchase voucher permanently?",
      },
    };
    dispatch(
      openConfirmDialog({
        targetId: id,
        actionType,
        ...(config[actionType] as any),
      }),
    );
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
        <h3 className="text-primary-600 flex items-center gap-2 text-xl font-bold">
          <Hash size={20} /> Purchase Invoices
        </h3>
        <Button size="xs" color="blue" onClick={() => setIsOpen(true)}>
          <Plus size={14} className="mr-1" /> Book Invoice
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell>Purchase No</TableHeadCell>
              <TableHeadCell>Supplier</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell className="text-right">Total Amount</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y">
            {purchases?.data.map((p: any) => (
              <TableRow key={p.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  #{p.purchase_no}
                </TableCell>
                <TableCell className="font-semibold">
                  {p.supplier_name || `Supplier ID: #${p.supplier_id}`}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <Calendar size={12} className="mr-1 inline" />
                  {new Date(p.purchase_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-mono font-black text-gray-900 dark:text-white">
                  ₹
                  {parseFloat(p.total_amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    color={p.status === "approved" ? "success" : "purple"}
                    className="w-fit text-[10px] font-bold uppercase"
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {p.status === "draft" && (
                      <button
                        onClick={(e) => handleAction(p.id, "post", e)}
                        className="rounded p-1 text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleAction(p.id, "delete", e)}
                      className="rounded p-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {purchases?.meta && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-gray-400">
            Page {purchases.meta.current_page} of {purchases.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={purchases.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <PurchaseFormModal show={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
