// src/features/invoicing/views/InvoicingTablePane.tsx
import React from "react";
import type { Invoice } from "../types";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Pagination,
} from "flowbite-react";
import { Calendar, Hash } from "lucide-react";

interface TablePaneProps {
  invoicesData?: any;
  page: number;
  setPage: (p: number) => void;
}

export const InvoicingTablePane: React.FC<TablePaneProps> = ({
  invoicesData,
  page,
  setPage,
}) => {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Invoice Reference
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Client Description
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Due Date
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-right dark:bg-gray-700">
                Amount
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-center dark:bg-gray-700">
                Status
              </TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {invoicesData?.data.map((inv: Invoice) => (
              <TableRow key={inv.id} className="bg-white dark:bg-gray-800">
                <TableCell className="flex items-center gap-1.5 py-4 font-mono text-xs font-bold text-gray-900 dark:text-white">
                  <Hash size={12} /> {inv.invoice_no}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {inv.client_name}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  <Calendar size={12} className="mr-1 inline" />
                  {new Date(inv.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-gray-900 dark:text-white">
                  ₹
                  {inv.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    color={
                      inv.status === "paid"
                        ? "success"
                        : inv.status === "overdue"
                          ? "failure"
                          : "warning"
                    }
                    className="mx-auto w-fit font-bold"
                  >
                    {inv.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {invoicesData && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {invoicesData.current_page} of {invoicesData.last_page} (
            {invoicesData.total} items)
          </p>
          <Pagination
            currentPage={page}
            totalPages={invoicesData.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
    </div>
  );
};
