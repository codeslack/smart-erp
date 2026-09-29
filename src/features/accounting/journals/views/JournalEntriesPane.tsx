// src/features/accounting/journals/views/JournalEntriesPane.tsx
import React, { useState } from "react";
import { useGetJournalsQuery } from "../api/journalsApi";
import { JournalLinesSubRow } from "./JournalLinesSubRow";
import { JournalFormModal } from "./JournalFormModal";
import { useAppDispatch } from "@/store/hooks";
import { openConfirmDialog } from "@/store/confirmSlice"; // FIXED: Loaded clean global click triggers
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
  Hash,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { JournalVoucher } from "../types/journalTypes";

export const JournalEntriesPane: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JournalVoucher | null>(null);

  const { data: journals, isLoading } = useGetJournalsQuery({ page });

  // FIXED: Trigger the entire multi-tenant approval chain with one short line!
  const handleTriggerAction = (
    id: number,
    actionType: "post" | "cancel" | "delete",
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const config = {
      post: {
        title: "Commit Voucher",
        message: "Post this voucher officially to the General Ledger?",
      },
      cancel: {
        title: "Void Voucher",
        message: "Void this voucher transaction permanently?",
      },
      delete: {
        title: "Purge Record",
        message:
          "Are you certain you want to erase this general journal transaction? This operation is permanent.",
      },
    };
    dispatch(
      openConfirmDialog({ targetId: id, actionType, ...config[actionType] }),
    );
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
                Actions
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
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.description}
                  </TableCell>
                  <TableCell>
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
                            onClick={(e) =>
                              handleTriggerAction(entry.id, "post", e)
                            }
                            className="rounded p-1 text-green-600"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={(e) =>
                              handleTriggerAction(entry.id, "cancel", e)
                            }
                            className="rounded p-1 text-amber-500"
                          >
                            <XCircle size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditTarget(entry);
                              setIsModalOpen(true);
                            }}
                            className="rounded p-1 text-blue-600"
                          >
                            <Edit2 size={13} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) =>
                          handleTriggerAction(entry.id, "delete", e)
                        }
                        className="rounded p-1 text-red-600"
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
        <div className="flex items-center justify-between border-t pt-4">
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
      <JournalFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
