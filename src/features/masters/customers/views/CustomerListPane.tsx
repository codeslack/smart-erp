import React, { useState } from "react";
import {
  useGetCustomersQuery,
  useDeleteCustomerMutation,
} from "../api/customersApi";
import { CustomerFormModal } from "./CustomerFormModal";
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
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";

export const CustomerListPane: React.FC = () => {
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [isOpen, setIsOpen] = useState(false),
    [target, setTarget] = useState<any>(null);
  const { data: customers, isLoading } = useGetCustomersQuery({ page, search }),
    [deleteCustomer] = useDeleteCustomerMutation();

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
          <h3 className="text-primary-600 flex items-center gap-2 text-xl font-bold">
            <Users size={20} /> Customer Directory
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <TextInput
            placeholder="Search customers..."
            icon={Search as any}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sizing="sm"
            className="max-w-xs"
          />
          <Button
            size="xs"
            color="blue"
            onClick={() => {
              setTarget(null);
              setIsOpen(true);
            }}
          >
            <Plus size={14} className="mr-1" /> Add Customer
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell>Firm Name</TableHeadCell>
              <TableHeadCell>Contact Person</TableHeadCell>
              <TableHeadCell>Phone/Email</TableHeadCell>
              <TableHeadCell>GSTIN</TableHeadCell>
              <TableHeadCell className="text-right">
                Ledger Balance
              </TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell className="text-center">Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y">
            {/* Replace the row map items loop around line 35 inside CustomerListPane.tsx */}
            {customers?.data.map((c) => (
              <TableRow key={c.id} className="bg-white dark:bg-gray-800">
                {/* FIXED: Reading updated layout keys matching Laravel schema models */}
                <TableCell className="font-bold text-gray-900 dark:text-white">
                  {c.code && (
                    <Badge
                      color="purple"
                      className="mr-2 inline w-fit font-mono text-[10px]"
                    >
                      {c.code}
                    </Badge>
                  )}
                  {c.name}
                </TableCell>
                <TableCell>{c.contact_person || "—"}</TableCell>
                <TableCell className="text-xs">
                  <div>{c.phone || "—"}</div>
                  <div className="text-gray-400">{c.email || ""}</div>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {c.tax_number || "—"}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-gray-900">
                  ₹
                  {parseFloat(c.current_balance || "0").toLocaleString(
                    "en-IN",
                    { minimumFractionDigits: 2 },
                  )}
                </TableCell>
                <TableCell>
                  <Badge color={c.is_active ? "success" : "failure"}>
                    {c.is_active ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setTarget(c);
                        setIsOpen(true);
                      }}
                      className="p-1 text-blue-600"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Delete entry?"))
                          await deleteCustomer(c.id);
                      }}
                      className="p-1 text-red-600"
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
      {customers?.meta && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-xs text-gray-400">
            Page {customers.meta.current_page} of {customers.meta.last_page}
          </p>
          <Pagination
            currentPage={page}
            totalPages={customers.meta.last_page}
            onPageChange={(p) => setPage(p)}
            showIcons
            previousLabel=""
            nextLabel=""
          />
        </div>
      )}
      <CustomerFormModal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        editTarget={target}
      />
    </div>
  );
};
