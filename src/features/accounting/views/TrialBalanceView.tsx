// src/features/accounting/views/TrialBalanceView.tsx

import React from "react";
import { useGetTrialBalanceQuery } from "../api/accountingApi";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Alert,
  Badge,
} from "flowbite-react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const TrialBalanceView: React.FC = () => {
  const { data: response, isLoading } = useGetTrialBalanceQuery();

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  const tb = response?.data;

  return (
    <div className="space-y-4 font-sans">
      {tb && (
        <Alert
          color={tb.is_balanced ? "success" : "failure"}
          icon={tb.is_balanced ? CheckCircle2 : AlertTriangle}
        >
          <span className="font-bold">Ledger Balance Summary:</span>{" "}
          {tb.is_balanced
            ? "Debits and Credits are matching across all systems."
            : "Auditing Warning: Discrepancy detected between ledger parameters."}
        </Alert>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm dark:border-gray-700">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="bg-gray-50 text-sm dark:bg-gray-700">
                Account Code / Name
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-sm dark:bg-gray-700">
                Type
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-right text-sm dark:bg-gray-700">
                Debit
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-right text-sm dark:bg-gray-700">
                Credit
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tb?.accounts.map((acc) => (
              <TableRow
                key={acc.account_code}
                className="bg-white dark:bg-gray-800"
              >
                <TableCell className="py-2.5 font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-primary-600 mr-3 font-mono text-xs font-bold">
                    {acc.account_code}
                  </span>
                  {acc.account_name}
                </TableCell>
                <TableCell>
                  <Badge
                    color="gray"
                    className="w-fit text-[10px] font-bold uppercase"
                  >
                    {acc.account_type}
                  </Badge>
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-medium text-gray-900 dark:text-white">
                  {acc.debit > 0
                    ? `₹${acc.debit.toLocaleString("en-IN")}`
                    : "—"}
                </TableCell>
                <TableCell className="py-2.5 text-right font-mono font-medium text-gray-900 dark:text-white">
                  {acc.credit > 0
                    ? `₹${acc.credit.toLocaleString("en-IN")}`
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="border-t-4 border-double bg-gray-50 text-sm font-black dark:bg-gray-700/60">
              <TableCell colSpan={2} className="text-gray-900 dark:text-white">
                Total Summary Balance
              </TableCell>
              <TableCell className="text-right font-mono text-base text-gray-900 dark:text-white">
                ₹
                {tb?.total_debit.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right font-mono text-base text-gray-900 dark:text-white">
                ₹
                {tb?.total_credit.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
