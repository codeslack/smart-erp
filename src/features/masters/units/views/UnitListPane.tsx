import React, { useState } from "react";
import { useGetUnitsQuery, useDeleteUnitMutation } from "../api/unitsApi";
import { UnitFormModal } from "./UnitFormModal";
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
import { Plus, Search, Edit2, Trash2, Scale } from "lucide-react";
import type { Unit } from "../types/unitTypes";

export const UnitListPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Unit | null>(null);

  const { data: units, isLoading } = useGetUnitsQuery({ page, search });
  const [deleteUnit] = useDeleteUnitMutation();

  const handleTriggerCreate = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };
  const handleTriggerEdit = (u: Unit) => {
    setEditTarget(u);
    setIsModalOpen(true);
  };
  const handleDelete = async (uuid: string) => {
    if (window.confirm("Delete unit entry?")) await deleteUnit(uuid);
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
            <Scale size={20} className="text-primary-600" /> Measurement Units
            Registry
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <TextInput
            placeholder="Search units..."
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
            <Plus size={14} className="mr-1" /> Add Unit
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Unit Name</TableHeadCell>
              <TableHeadCell>Abbreviation</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {units?.data.map((u) => (
              <TableRow key={u.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs text-gray-400">
                  #{u.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {u.name}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-gray-500">
                  {u.short_name}
                </TableCell>
                <TableCell>
                  <Badge
                    color={u.is_active ? "success" : "failure"}
                    className="w-fit font-bold"
                  >
                    {u.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleTriggerEdit(u)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.uuid)}
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
      {units?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {units.meta.current_page} of {units.meta.last_page} (
            {units.meta.total} elements)
          </p>
          <Pagination
            currentPage={page}
            totalPages={units.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <UnitFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
