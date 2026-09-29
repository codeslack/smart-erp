import React, { useState } from "react";
import { useGetAreasQuery, useDeleteAreaMutation } from "../api/areasApi";
import { AreaFormModal } from "./AreaFormModal";
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
import { Plus, Search, Edit2, Trash2, Tag } from "lucide-react";
import type { Area } from "../types/areaTypes";

export const AreaListPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Area | null>(null);

  const { data: areas, isLoading } = useGetAreasQuery({ page, search });
  const [deleteArea] = useDeleteAreaMutation();

  const handleTriggerCreate = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };
  const handleTriggerEdit = (b: Area) => {
    setEditTarget(b);
    setIsModalOpen(true);
  };
  const handleDelete = async (uuid: string) => {
    if (window.confirm("Delete area entry?")) await deleteArea(uuid);
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
            <Tag size={20} className="text-primary-600" /> Area Master Registry
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <TextInput
            placeholder="Search areas..."
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
            <Plus size={14} className="mr-1" /> Add Area
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Area Name</TableHeadCell>
              <TableHeadCell>Slug Key</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {areas?.data.map((b) => (
              <TableRow key={b.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs text-gray-400">
                  #{b.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {b.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-500">
                  {b.slug}
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {b.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    color={b.is_active ? "success" : "failure"}
                    className="w-fit font-bold"
                  >
                    {b.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleTriggerEdit(b)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.uuid)}
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
      {areas?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {areas.meta.current_page} of {areas.meta.last_page} (
            {areas.meta.total} elements)
          </p>
          <Pagination
            currentPage={page}
            totalPages={areas.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <AreaFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
