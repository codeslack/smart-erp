// src/features/purchase/orders/views/PurchaseOrderPane.tsx
import React, { useState } from "react";
import { useGetPurchaseOrdersQuery } from "../../api";
import { OrderFormModal } from "./OrderFormModal"; // FIXED: Imported form popup component
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
import { ShoppingBag, Calendar, CheckCircle, Plus } from "lucide-react";

export const PurchaseOrderPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false); // Modal display control state hook
  const { data: orders, isLoading } = useGetPurchaseOrdersQuery({ page });

  const handleApprove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(
      openConfirmDialog({
        targetId: id,
        actionType: "post",
        title: "Approve Purchase Order",
        message:
          "Authorize this purchase order request? This locks parameters.",
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
          <ShoppingBag size={20} /> Purchase Orders Registry
        </h3>
        {/* FIXED: Added a button to fire up our custom creation modal loop */}
        <Button size="xs" color="blue" onClick={() => setIsOpen(true)}>
          <Plus size={14} className="mr-1" /> Create Order
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell>Order No</TableHeadCell>
              <TableHeadCell>Supplier Firm</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell className="text-right">
                Estimated Amount
              </TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y">
            {orders?.data.map((o) => (
              <TableRow key={o.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  #{o.order_no}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {o.supplier_name}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <Calendar size={12} className="mr-1 inline" />
                  {new Date(o.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-mono font-black text-gray-900 dark:text-white">
                  ₹
                  {parseFloat(o.total).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    color={o.status === "approved" ? "success" : "purple"}
                    className="w-fit text-[10px] font-bold uppercase"
                  >
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {o.status === "draft" && (
                    <button
                      onClick={(e) => handleApprove(o.id, e)}
                      className="rounded p-1 text-green-600 hover:bg-green-50"
                      title="Approve"
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {orders?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {orders.meta.current_page} of {orders.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={orders.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}

      {/* Render the structural form popup modal container */}
      <OrderFormModal show={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
