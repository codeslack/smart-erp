import React, { useState } from "react";
import {
  useGetWarehousesQuery,
  useDeleteWarehouseMutation,
} from "../api/warehousesApi";
import { WarehouseFormModal } from "./WarehouseFormModal";
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
  TextInput,
} from "flowbite-react";
import { Plus, Search, Edit2, Trash2, Home } from "lucide-react";
import type { Warehouse } from "../types/warehouseTypes";

export const WarehouseListPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Warehouse | null>(null);

  const { data: warehouses, isLoading } = useGetWarehousesQuery({
    page,
    search,
  });
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  const handleTriggerCreate = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };
  const handleTriggerEdit = (w: Warehouse) => {
    setEditTarget(w);
    setIsModalOpen(true);
  };
  const handleDelete = async (uuid: string) => {
    if (window.confirm("Delete warehouse entry permanently?"))
      await deleteWarehouse(uuid);
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center dark:border-gray-700">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Home size={20} className="text-primary-600" /> Warehouse Inventory
            Hubs
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <TextInput
            placeholder="Search locations..."
            icon={Search as any}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sizing="sm"
            className="w-full max-w-xs"
          />
          <Button
            size="xs"
            color="blue"
            className="font-semibold whitespace-nowrap"
            onClick={handleTriggerCreate}
          >
            <Plus size={14} className="mr-1" /> Add Warehouse
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>Code</TableHeadCell>
              <TableHeadCell>Hub Name</TableHeadCell>
              <TableHeadCell>Contact Details</TableHeadCell>
              <TableHeadCell>Address</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {warehouses?.data.map((w) => (
              <TableRow key={w.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold">
                  <Badge color="purple" className="w-fit">
                    {w.code}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {w.name}
                </TableCell>
                <TableCell className="space-y-0.5 text-xs text-gray-500">
                  <div>{w.phone || "—"}</div>
                  <div className="text-gray-400 italic">{w.email || ""}</div>
                </TableCell>
                <TableCell className="max-w-xs truncate text-sm text-gray-500 dark:text-gray-400">
                  {w.address || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    color={w.is_active ? "success" : "failure"}
                    className="w-fit font-bold"
                  >
                    {w.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleTriggerEdit(w)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(w.uuid)}
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {warehouses?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {warehouses.meta.current_page} of {warehouses.meta.last_page} (
            {warehouses.meta.total} elements)
          </p>
          <Pagination
            currentPage={page}
            totalPages={warehouses.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <WarehouseFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
