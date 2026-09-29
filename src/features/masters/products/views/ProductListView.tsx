// src/features/masters/products/views/ProductListView.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Pagination } from "flowbite-react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../api/productsApi";
import { ProductFiltersBar } from "./ProductFiltersBar";
import { ProductListTable } from "./ProductListTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { SkeletonTable } from "@/components/ui/SkeletonTable"; // Integrated skeleton component
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";
import type { ProductFilters } from "../types/productTypes";
import {
  RefreshCcwDot,
  CirclePlus,
} from "lucide-react";

export const ProductListView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    per_page: 10,
  });
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeletingState, setIsDeletingState] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProduct = async () => {
    setIsCreating(true);
    try {
      // Triggers the navigation route or API mutation
      await navigate("/masters/products/create");
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery(filters);
  const [deleteProduct] = useDeleteProductMutation();

  const handleConfirmDelete = async () => {
    if (!deleteTargetUuid) return;
    try {
      setIsDeletingState(true);
      await deleteProduct(deleteTargetUuid).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Product record removed successfully.",
        }),
      );
      setDeleteTargetUuid(null);
    } catch {
      dispatch(
        showToast({
          type: "failure",
          message: "Failed to delete product details.",
        }),
      );
    } finally {
      setIsDeletingState(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Master Registry
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage inventory entities, pricing matrix points, and
            variant mappings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Button
              color="alternative"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching || isCreating}
            >
              <RefreshCcwDot
                className={`me-1 h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Sync..." : "Sync"}
            </Button>

            <Button
              color="alternative"
              size="sm"
              disabled={isFetching || isCreating}
              onClick={handleCreateProduct}
            >
              {isCreating ? (
                <RefreshCcwDot className="me-1 h-5 w-5 animate-spin" />
              ) : (
                <CirclePlus className="me-1 h-5 w-5" />
              )}
              {isCreating ? "Creating..." : "Create Product"}
            </Button>
          </ButtonGroup>
        </div>
      </div>

      <ProductFiltersBar filters={filters} onChange={setFilters} />

      {/* Renders Skeleton table pattern layout smoothly during main initialization cycles */}
      {isLoading ? (
        <SkeletonTable rows={6} columns={6} />
      ) : (
        <>
          <div
            className={
              isFetching
                ? "pointer-events-none opacity-50 transition-opacity"
                : ""
            }
          >
            <ProductListTable
              products={response?.data || []}
              onDelete={(id) => setDeleteTargetUuid(id)}
            />
          </div>

          {response?.meta && response.meta.last_page > 1 && (
            <div className="flex justify-end pt-4">
              <Pagination
                currentPage={filters.page || 1}
                totalPages={response.meta.last_page}
                onPageChange={(p) =>
                  setFilters((prev) => ({ ...prev, page: p }))
                }
                showIcons
              />
            </div>
          )}
        </>
      )}

      <ConfirmModal
        show={!!deleteTargetUuid}
        onClose={() => setDeleteTargetUuid(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingState}
        title="Delete Product Matrix Asset"
        message="Are you completely sure you want to delete this master item record? This operation handles complete data clearing sequences across variations."
      />
    </div>
  );
};
