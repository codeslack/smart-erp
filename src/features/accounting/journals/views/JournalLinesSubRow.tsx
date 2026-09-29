import React from "react";
import type { JournalLineItem } from "../types/journalTypes";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
} from "flowbite-react";

export const JournalLinesSubRow: React.FC<{ lines: JournalLineItem[] }> = ({
  lines,
}) => {
  return (
    <div className="mx-4 mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 font-sans dark:border-gray-700 dark:bg-gray-900/50">
      <Table className="!bg-transparent">
        <TableHead>
          <TableRow>
            <TableHeadCell className="bg-transparent py-2 text-[11px]">
              Account Name Element
            </TableHeadCell>
            <TableHeadCell className="bg-transparent py-2 text-right text-[11px]">
              Debit
            </TableHeadCell>
            <TableHeadCell className="bg-transparent py-2 text-right text-[11px]">
              Credit
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
          {lines.map((l, i) => (
            <TableRow key={l.id || i} className="bg-transparent">
              <TableCell className="py-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-[10px] dark:bg-gray-700">
                  ID: {l.chart_of_account_id}
                </span>
                {l.account_name || `Account Object #${l.chart_of_account_id}`}
              </TableCell>
              <TableCell className="py-2 text-right font-mono text-xs font-bold text-green-600">
                {parseFloat(l.debit) > 0
                  ? `₹${parseFloat(l.debit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                  : "—"}
              </TableCell>
              <TableCell className="py-2 text-right font-mono text-xs font-bold text-gray-900 dark:text-white">
                {parseFloat(l.credit) > 0
                  ? `₹${parseFloat(l.credit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
