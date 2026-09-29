import React, { useState } from "react";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "../api/categoriesApi";
import { CategoryFormModal } from "./CategoryFormModal";
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
import { Plus, Search, Edit2, Trash2, Layers } from "lucide-react";
import type { Category } from "../types/categoryTypes";

export const CategoryListPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const { data: categories, isLoading } = useGetCategoriesQuery({
    page,
    search,
  });
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleTriggerCreate = () => {
    setEditTarget(null);
    setIsModalOpen(true);
  };
  const handleTriggerEdit = (c: Category) => {
    setEditTarget(c);
    setIsModalOpen(true);
  };
  const handleDelete = async (uuid: string) => {
    if (window.confirm("Delete category entry permanently?"))
      await deleteCategory(uuid);
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
            <Layers size={20} className="text-primary-600" /> Stock Category
            Registry
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <TextInput
            placeholder="Search categories..."
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
            <Plus size={14} className="mr-1" /> Add Category
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Category Name</TableHeadCell>
              <TableHeadCell>System Code</TableHeadCell>
              <TableHeadCell>Description</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories?.data.map((c) => (
              <TableRow key={c.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs text-gray-400">
                  #{c.id}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 dark:text-white">
                  {c.name}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold text-gray-500">
                  <Badge color="purple" className="w-fit">
                    {c.code}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                  {c.description || "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    color={c.is_active ? "success" : "failure"}
                    className="w-fit font-bold"
                  >
                    {c.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleTriggerEdit(c)}
                      className="rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.uuid)}
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
      {categories?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {categories.meta.current_page} of {categories.meta.last_page} (
            {categories.meta.total} elements)
          </p>
          <Pagination
            currentPage={page}
            totalPages={categories.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <CategoryFormModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editTarget={editTarget}
      />
    </div>
  );
};
