// src/features/accounting/journals/views/JournalEntriesPane.tsx
import React, { useState } from "react";
import {
  useGetJournalsQuery,
  useDeleteJournalMutation,
  usePostJournalVoucherMutation,
  useCancelJournalVoucherMutation,
} from "../api/journalsApi";
import { JournalLinesSubRow } from "./JournalLinesSubRow";
import { JournalFormModal } from "./JournalFormModal";
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
  Button,
} from "flowbite-react";
import {
  Calendar,
  Hash,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const JournalEntriesPanex: React.FC = () => {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);

  const { data: journals, isLoading } = useGetJournalsQuery({ page });
  const [deleteJournal] = useDeleteJournalMutation();
  const [postVoucher, { isLoading: isPosting }] =
    usePostJournalVoucherMutation();
  const [cancelVoucher, { isLoading: isCancelling }] =
    useCancelJournalVoucherMutation();

  const handlePost = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Post this voucher officially to the General Ledger?"))
      await postVoucher(id);
  };
  const handleCancel = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Void this voucher transaction permanently?"))
      await cancelVoucher(id);
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          Journal Voucher Registry
        </h4>
        <Button
          size="xs"
          color="blue"
          className="font-semibold"
          onClick={() => {
            setEditTarget(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={14} className="mr-1" /> New Voucher
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="w-10 bg-gray-50 dark:bg-gray-700"></TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Voucher No
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
              <TableHeadCell className="bg-gray-50 text-center dark:bg-gray-700">
                Workflow Actions
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
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                    <Hash size={12} className="mr-1 inline" />
                    {entry.voucher_no}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    <Calendar size={12} className="mr-1 inline" />
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.description}
                  </TableCell>
                  <TableCell>
                    {/* FIXED: Dynamic color badge representation matching your exact status state string values */}
                    <Badge
                      color={
                        entry.status === "posted"
                          ? "success"
                          : entry.status === "cancelled"
                            ? "failure"
                            : "purple"
                      }
                      className="w-fit text-[10px] font-bold uppercase"
                    >
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-2 text-center">
                    <div className="flex justify-center gap-1">
                      {entry.status === "draft" && (
                        <>
                          <button
                            onClick={(e) => handlePost(entry.id, e)}
                            disabled={isPosting}
                            className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40"
                            title="Post to Ledger"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={(e) => handleCancel(entry.id, e)}
                            disabled={isCancelling}
                            className="rounded p-1 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            title="Void Voucher"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditTarget(entry);
                              setIsModalOpen(true);
                            }}
                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (
                            window.confirm("Delete voucher record permanently?")
                          )
                            await deleteJournal(entry.id);
                        }}
                        className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedId === entry.id && (
                  <TableRow className="bg-gray-50/50">
                    <TableCell colSpan={6} className="border-none !p-0">
                      <JournalLinesSubRow lines={entry.lines} />
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
      <JournalFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
