// src/features/purchase/grn/views/GoodsReceivePane.tsx
import React, { useState } from "react";
import { useGetGRNsQuery } from "../../api";
import { GrnFormModal } from "./GrnFormModal";
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
import { ClipboardCheck, Hash, Plus } from "lucide-react";

export const GoodsReceivePane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { data: grns, isLoading } = useGetGRNsQuery({ page });

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
          <ClipboardCheck size={20} /> Goods Receipt Notes (GRN)
        </h3>
        <Button size="xs" color="blue" onClick={() => setIsOpen(true)}>
          <Plus size={14} className="mr-1" /> Log Receipt
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell>GRN Document No</TableHeadCell>
              <TableHeadCell>Source PO Ref</TableHeadCell>
              <TableHeadCell>Supplier</TableHeadCell>
              <TableHeadCell className="text-center">
                Qty Received
              </TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y">
            {grns?.data.map((g) => (
              <TableRow key={g.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  <Hash size={12} className="mr-1 inline" />
                  {g.grn_no}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  #{g.purchase_order_no}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {g.supplier_name}
                </TableCell>
                <TableCell className="text-center font-mono font-bold text-gray-900 dark:text-white">
                  {g.total_items_received} units
                </TableCell>
                <TableCell>
                  <Badge
                    color={g.status === "received" ? "success" : "warning"}
                    className="w-fit text-[10px] font-bold uppercase"
                  >
                    {g.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {grns?.meta && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs font-medium text-gray-400">
            Page {grns.meta.current_page} of {grns.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={grns.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <GrnFormModal show={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};
