// src/features/masters/categories/views/CategoryListView.tsx
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Badge, TextInput, Pagination } from "flowbite-react";
import { useGetCategoriesQuery, useDeleteCategoryMutation } from "../api/categoriesApi";
import { CategoryFormModal } from "./CategoryFormModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";
import type { CategoryFilters } from "../types/categoryTypes";

export const CategoryListView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<CategoryFilters>({ page: 1, per_page: 10, search: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<any | null>(null);
  
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeletingState, setIsDeletingState] = useState(false);

  const { data: response, isLoading, isFetching, refetch } = useGetCategoriesQuery(filters);
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleConfirmDelete = async () => {
    if (!deleteTargetUuid) return;
    try {
      setIsDeletingState(true);
      await deleteCategory(deleteTargetUuid).unwrap();
      dispatch(showToast({ type: "success", message: "Category record deleted successfully." }));
      setDeleteTargetUuid(null);
    } catch {
      dispatch(showToast({ type: "failure", message: "Failed to delete category record." }));
    } finally {
      setIsDeletingState(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Categories</h1>
          <p className="text-sm text-gray-500">Organise your asset master index registry cleanly using hierarchical clusters.</p>
        </div>
        
        <div className="flex gap-2">
          <Button color="light" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Refreshing..." : "🔄 Refresh"}
          </Button>
          <Button color="blue" size="sm" onClick={() => { setEditTarget(null); setModalOpen(true); }}>+ Add Category</Button>
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <TextInput
          placeholder="Filter categories by name or code..."
          value={filters.search || ""}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
        />
      </div>

      {isLoading ? (
        <SkeletonTable rows={5} columns={5} />
      ) : (
        <>
          <div className={`overflow-x-auto rounded-lg border ${isFetching ? "opacity-60 pointer-events-none" : ""}`}>
            <Table hoverable>
              <TableHead className="bg-gray-100 dark:bg-gray-700">
                <TableRow>
                  <TableHeadCell>Category Details</TableHeadCell>
                  <TableHeadCell>Shorthand Code</TableHeadCell>
                  <TableHeadCell>Description</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell className="text-right">Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {(response?.data || []).length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-6">No matching category records located.</TableCell></TableRow>
                ) : (
                  (response?.data || []).map((c) => (
                    <TableRow key={c.uuid} className="bg-white dark:bg-gray-800">
                      <TableCell className="font-semibold text-gray-900 dark:text-white">{c.name}</TableCell>
                      <TableCell className="font-mono text-sm">{c.code}</TableCell>
                      <TableCell className="text-gray-500 max-w-xs truncate">{c.description || "—"}</TableCell>
                      <TableCell><Badge color={c.is_active ? "success" : "failure"} className="w-fit">{c.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="xs" color="light" onClick={() => { setEditTarget(c); setModalOpen(true); }}>Edit</Button>
                          <Button size="xs" color="failure" onClick={() => setDeleteTargetUuid(c.uuid)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {response?.meta && response.meta.last_page > 1 && (
            <div className="flex justify-end pt-2">
              <Pagination currentPage={filters.page || 1} totalPages={response.meta.last_page} onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))} showIcons />
            </div>
          )}
        </>
      )}

      <CategoryFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editTarget={editTarget} />

      <ConfirmModal 
        show={!!deleteTargetUuid} 
        onClose={() => setDeleteTargetUuid(null)} 
        onConfirm={handleConfirmDelete} 
        isLoading={isDeletingState}
        title="Delete Category"
        message="Are you sure you want to delete this product category? This action cannot be reversed."
      />
    </div>
  );
};
