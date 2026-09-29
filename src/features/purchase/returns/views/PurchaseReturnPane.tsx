// src/features/purchase/returns/views/PurchaseReturnPane.tsx
import React, { useState } from "react";
import { useGetPurchaseReturnsQuery } from "../../api";
import { ReturnFormModal } from "./ReturnFormModal";
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
import { ArrowLeftRight, Calendar, Plus } from "lucide-react";

export const PurchaseReturnPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { data: returns, isLoading } = useGetPurchaseReturnsQuery({ page });

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
          <ArrowLeftRight size={20} /> Supplier Debit Returns
        </h3>
        <Button size="xs" color="blue" onClick={() => setIsOpen(true)}>
          <Plus size={14} className="mr-1" /> Issue Return
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell>Return No</TableHeadCell>
              <TableHeadCell>Supplier</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
              <TableHeadCell className="text-right">Refund Value</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y">
            {returns?.data.map((r) => (
              <TableRow key={r.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  #{r.return_no}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {r.supplier_name}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <Calendar size={12} className="mr-1 inline" />
                  {new Date(r.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-mono font-black text-red-500">
                  ₹
                  {parseFloat(r.total).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    color="success"
                    className="w-fit text-[10px] font-bold uppercase"
                  >
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {returns?.meta && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-gray-400">
            Page {returns.meta.current_page} of {returns.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={returns.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <ReturnFormModal show={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
