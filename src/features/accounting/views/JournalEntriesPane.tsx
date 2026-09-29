// src/features/accounting/views/JournalEntriesPane.tsx
import React, { useState } from "react";
import { useGetJournalEntriesQuery } from "../api/accountingApi";
import { JournalLinesRow } from "./JournalLinesRow"; // Loaded new atomic file
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
import { Calendar, Hash, ChevronDown, ChevronUp } from "lucide-react";

export const JournalEntriesPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: journals, isLoading } = useGetJournalEntriesQuery({ page });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="w-10 bg-gray-50 dark:bg-gray-700"></TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Voucher No
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Type
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Posting Date
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Description Memo
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Status
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {journals?.data.map((entry) => (
              <React.Fragment key={entry.id}>
                <TableRow
                  className="cursor-pointer bg-white dark:bg-gray-800"
                  onClick={() =>
                    setExpandedId(expandedId === entry.id ? null : entry.id)
                  }
                >
                  <TableCell className="p-3">
                    {expandedId === entry.id ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </TableCell>
                  <TableCell className="flex items-center gap-1.5 py-4 font-mono text-xs font-bold text-gray-900 dark:text-white">
                    <Hash size={12} /> {entry.voucher_no}
                  </TableCell>
                  <TableCell>
                    <Badge
                      color="info"
                      className="w-fit font-semibold uppercase"
                    >
                      {entry.voucher_type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    <Calendar size={13} className="mr-1 inline" />
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.description}
                  </TableCell>
                  <TableCell>
                    <Badge color="success" className="w-fit font-bold">
                      {entry.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
                {expandedId === entry.id && (
                  <TableRow className="bg-gray-50/50">
                    <TableCell colSpan={6} className="border-none !p-0">
                      {/* FIXED: No network fetch required. Passing eager lines array data instantly! */}
                      <JournalLinesRow lines={entry.lines} />
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      {journals?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {journals.meta.current_page} of {journals.meta.last_page} (
            {journals.meta.total} postings)
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
