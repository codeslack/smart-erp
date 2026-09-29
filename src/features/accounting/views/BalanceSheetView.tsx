// src/features/accounting/views/BalanceSheetView.tsx
import React from "react";
import { useGetBalanceSheetQuery } from "../api/accountingApi";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Alert,
} from "flowbite-react";
import { Scale, CheckCircle2, AlertTriangle } from "lucide-react";

export const BalanceSheetView: React.FC = () => {
  const { data: response, isLoading } = useGetBalanceSheetQuery();

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  const bs = response?.data;

  // FIXED: Changed '||' to '=' to assign a valid TypeScript default parameter fallback array
  const renderRows = (items: any[] = []) =>
    items.map((item) => (
      <TableRow key={item.account_code} className="bg-white dark:bg-gray-800">
        <TableCell className="py-2.5 font-medium text-gray-700 dark:text-gray-300">
          <span className="text-primary-600 mr-3 font-mono text-xs font-bold">
            {item.account_code}
          </span>
          {item.account_name}
        </TableCell>
        <TableCell className="py-2.5 text-right font-mono font-bold text-gray-900 dark:text-white">
          ₹{item.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </TableCell>
      </TableRow>
    ));

  return (
    <div className="space-y-4 font-sans">
      {/* Safety Balance Indicator Banner */}
      {bs && (
        <Alert
          color={bs.is_balanced ? "success" : "failure"}
          icon={bs.is_balanced ? CheckCircle2 : AlertTriangle}
        >
          <span className="font-bold">Ledger Balance Status:</span>{" "}
          {bs.is_balanced
            ? "Book calculations balance cleanly across Assets and Capital parameters."
            : "Auditing Warning: Equation variance detected."}
        </Alert>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm dark:border-gray-700">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="bg-gray-50 text-sm dark:bg-gray-700">
                Account Mapping Category
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-right text-sm dark:bg-gray-700">
                Net Value
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* ASSETS SECTION */}
            <TableRow className="bg-gray-100/50 font-extrabold tracking-wide dark:bg-gray-700/30">
              <TableCell colSpan={2} className="text-primary-600 py-2 text-xs">
                ASSETS
              </TableCell>
            </TableRow>
            {renderRows(bs?.assets)}
            <TableRow className="border-t-2 bg-white font-bold dark:bg-gray-800">
              <TableCell className="pl-6 text-gray-900 dark:text-white">
                Total Current Assets
              </TableCell>
              <TableCell className="text-right font-mono text-gray-900 dark:text-white">
                ₹{bs?.total_assets.toLocaleString("en-IN")}
              </TableCell>
            </TableRow>

            {/* LIABILITIES SECTION */}
            <TableRow className="bg-gray-100/50 font-extrabold tracking-wide dark:bg-gray-700/30">
              <TableCell colSpan={2} className="py-2 text-xs text-red-500">
                LIABILITIES
              </TableCell>
            </TableRow>
            {renderRows(bs?.liabilities)}
            <TableRow className="border-t-2 bg-white font-bold dark:bg-gray-800">
              <TableCell className="pl-6 text-gray-900 dark:text-white">
                Total Current Liabilities
              </TableCell>
              <TableCell className="text-right font-mono text-gray-900 dark:text-white">
                ₹{bs?.total_liabilities.toLocaleString("en-IN")}
              </TableCell>
            </TableRow>

            {/* EQUITIES SECTION */}
            <TableRow className="bg-gray-100/50 font-extrabold tracking-wide dark:bg-gray-700/30">
              <TableCell colSpan={2} className="py-2 text-xs text-purple-600">
                EQUITIES & CAPITAL
              </TableCell>
            </TableRow>
            {renderRows(bs?.equities)}
            <TableRow className="border-t-2 bg-white font-bold dark:bg-gray-800">
              <TableCell className="pl-6 text-gray-900 dark:text-white">
                Total Capital Equity
              </TableCell>
              <TableCell className="text-right font-mono text-gray-900 dark:text-white">
                ₹{bs?.total_equity.toLocaleString("en-IN")}
              </TableCell>
            </TableRow>

            {/* SUMMARY SOLVENCY STATEMENT ROW */}
            <TableRow className="border-t-4 border-double bg-gray-50 text-sm font-black dark:bg-gray-700/60">
              <TableCell className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Scale size={18} className="text-primary-600" /> Total
                Liabilities and Equity Summary Balance
              </TableCell>
              <TableCell className="text-right font-mono text-base text-gray-900 dark:text-white">
                ₹
                {bs?.total_liabilities_and_equity.toLocaleString("en-IN", {
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
