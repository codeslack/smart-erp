// src/features/accounting/views/JournalLinesRow.tsx

import React from "react";
import type { JournalLine } from "../types";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";

interface JournalLinesRowProps {
  lines: JournalLine[];
}

export const JournalLinesRow: React.FC<JournalLinesRowProps> = ({ lines }) => {
  return (
    <div className="mx-4 mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 font-sans shadow-inner dark:border-gray-700 dark:bg-gray-900/40">
      <Table className="!bg-transparent">
        <TableHead>
          <TableRow>
            <TableHeadCell className="bg-transparent py-2 text-[11px] font-bold text-gray-400 uppercase">
              Account Element
            </TableHeadCell>
            <TableHeadCell className="bg-transparent py-2 text-right text-[11px] font-bold text-gray-400 uppercase">
              Debit
            </TableHeadCell>
            <TableHeadCell className="bg-transparent py-2 text-right text-[11px] font-bold text-gray-400 uppercase">
              Credit
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {lines.map((line) => (
            <TableRow key={line.id} className="bg-transparent">
              <TableCell className="py-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:bg-gray-700">
                  ID: {line.chart_of_account_id}
                </span>
                {line.account_name}
              </TableCell>
              <TableCell className="py-2 text-right font-mono text-xs font-semibold text-green-600 dark:text-green-400">
                {parseFloat(line.debit) > 0
                  ? `₹${parseFloat(line.debit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                  : "—"}
              </TableCell>
              <TableCell className="py-2 text-right font-mono text-xs font-semibold text-gray-900 dark:text-white">
                {parseFloat(line.credit) > 0
                  ? `₹${parseFloat(line.credit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
