import React from "react";
import { useGetChartOfAccountsQuery } from "../api/accountingApi";
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Badge,
  Button,
} from "flowbite-react";
import { Landmark, FileSpreadsheet, RefreshCw } from "lucide-react";

export const ChartOfAccountsx: React.FC = () => {
  const {
    data: accounts,
    isLoading,
    error,
    refetch,
  } = useGetChartOfAccountsQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-20">
        <Spinner size="xl" color="info" />
        <p className="text-sm font-medium text-gray-500">
          Computing balanced ledger metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-gray-800 dark:text-red-400">
        Financial Error: Failed to secure trial accounting sheets from Laravel
        backend.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Accounting Header Tools */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Landmark className="text-primary-600 h-6 w-6" /> Chart of Accounts
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Real-time balancing matrix for auditing and general corporate
            ledgers.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            size="sm"
            color="gray"
            onClick={() => refetch()}
            className="font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" color="blue" className="font-semibold">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export Sheets
          </Button>
        </div>
      </div>

      {/* Flowbite Account Grid */}
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
              Account Code
            </TableHeadCell>
            <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
              Account Descriptor
            </TableHeadCell>
            <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
              Classification
            </TableHeadCell>
            <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
              Net Ledger Balance
            </TableHeadCell>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {accounts?.map((acc) => (
              <TableRow key={acc.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  {acc.code}
                </TableCell>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                  {acc.name}
                </TableCell>
                <TableCell>
                  <Badge
                    color={
                      acc.type === "asset"
                        ? "success"
                        : acc.type === "liability"
                          ? "failure"
                          : acc.type === "revenue"
                            ? "info"
                            : "purple"
                    }
                    className="w-fit font-bold"
                  >
                    {acc.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  $
                  {acc.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
