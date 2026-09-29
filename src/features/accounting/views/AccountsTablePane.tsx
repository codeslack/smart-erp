import React, { useState } from "react";
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
  Pagination,
} from "flowbite-react";

export const AccountsTablePane: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: accounts, isLoading } = useGetChartOfAccountsQuery({ page });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Account Code
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Descriptor
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Classification
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 text-end dark:bg-gray-700">
                Net Balance
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {accounts?.data.map((acc) => (
              <TableRow key={acc.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  {acc.account_code}
                </TableCell>
                <TableCell className="font-semibold text-gray-700 dark:text-gray-300">
                  {acc.account_name}
                </TableCell>
                <TableCell>
                  <Badge
                    color={
                      acc.account_type === "asset" ||
                      acc.account_type === "income"
                        ? "success"
                        : "failure"
                    }
                    className="w-fit font-bold"
                  >
                    {acc.account_type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-end font-bold text-gray-900 dark:text-white">
                  ₹{" "}
                  {parseFloat(acc.current_balance).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {accounts?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            Page {accounts.meta.current_page} of {accounts.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={accounts.meta.last_page}
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
