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
  invoicesData?: {
    data: Invoice[];
    current_page: number;
    last_page: number;
    total: number;
  };
  page: number;
  setPage: (p: number) => void;
}

export const InvoicingTablePane: React.FC<TablePaneProps> = ({
  invoicesData,
  page,
  setPage,
}) => {
  return (
    <div className="space-y-4 font-sans">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            {/* FIXED: Standardized row structural element protects DOM from hydration crashes */}
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
            {invoicesData?.data.map((inv) => (
              <TableRow key={inv.id} className="bg-white dark:bg-gray-800">
                <TableCell className="flex items-center gap-1.5 py-4 font-mono text-xs font-bold text-gray-900 dark:text-white">
                  <Hash size={12} className="text-gray-400" /> {inv.invoice_no}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {inv.client_name}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />{" "}
                    {new Date(inv.due_date).toLocaleDateString()}
                  </div>
                </TableCell>
                {/* FIXED: Localized currency format strings mapping the Indian Rupees token */}
                <TableCell className="text-right font-mono font-black text-gray-900 dark:text-white">
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
                    className="mx-auto w-fit font-bold uppercase"
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination control metrics sync block */}
      {invoicesData && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Showing billing entries{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {invoicesData.current_page}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {invoicesData.last_page}
            </span>{" "}
            ({invoicesData.total} records)
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
