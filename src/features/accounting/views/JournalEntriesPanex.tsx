import React, { useState } from "react";
import { useGetJournalEntriesQuery } from "../api/accountingApi";
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
import { Calendar } from "lucide-react";

export const JournalEntriesPanex: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: journals, isLoading } = useGetJournalEntriesQuery({ page });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {journals?.data.map((entry) => (
        <div
          key={entry.id}
          className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700"
        >
          <div className="flex flex-col justify-between gap-2 border-b border-gray-100 bg-gray-50 p-4 text-sm font-medium sm:flex-row dark:bg-gray-700/50">
            <span className="font-bold text-gray-900 dark:text-white">
              {entry.entry_number}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar size={14} />
              {entry.entry_date}
            </span>
            <Badge color={entry.status === "posted" ? "success" : "purple"}>
              {entry.status.toUpperCase()}
            </Badge>
          </div>
          <Table className="!rounded-none">
            <TableHead>
              <TableRow>
                <TableHeadCell>Account Code/Name</TableHeadCell>
                <TableHeadCell className="text-right">Debit</TableHeadCell>
                <TableHeadCell className="text-right">Credit</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {entry.lines.map((line) => (
                <TableRow key={line.id} className="bg-white dark:bg-gray-800">
                  <TableCell className="text-sm">
                    <span className="text-primary-600 mr-2 font-mono text-xs font-bold">
                      {line.account_code}
                    </span>
                    {line.account_name}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${line.debit.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${line.credit.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}

      {journals?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs text-gray-400">
            Page {journals.meta.current_page} of {journals.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={journals.meta.last_page}
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
