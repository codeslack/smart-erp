import React, { useState } from "react";
import { useGetUsersQuery } from "../api/userManagementApi";
import { useAppDispatch } from "@/store/hooks";
import { openGlobalDrawer } from "@/store/uiSlice"; // FIXED: Importing from correct global UI slice location
import {
  Table,
  Button,
  Spinner,
  Badge,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "flowbite-react";
import { UserCheck, ShieldCheck, RefreshCw, Calendar } from "lucide-react";

export const UserList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const {
    data: paginatedUsers,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({ page });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-20">
        <Spinner size="xl" color="info" />
        <p className="text-sm font-medium text-gray-500">
          Extracting isolated user entries...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-gray-800 dark:text-red-400">
        Access Intercept: Unable to fetch scoped tenant data from Laravel. Check
        X-Tenant header.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            System User Directory
          </h3>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Personnel database isolation scoped via your active organization
            profile.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            size="sm"
            color="gray"
            onClick={() => refetch()}
            className="font-semibold"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Sync Data
          </Button>

          {/* FIXED: Wrapped openGlobalDrawer cleanly inside the dispatch pipeline action trigger */}
          <Button
            size="sm"
            color="blue"
            onClick={() =>
              dispatch(openGlobalDrawer({ contentType: "ADD_USER" }))
            }
            className="font-semibold"
          >
            <UserCheck className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                User ID
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Tenant ID
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Employee Profile
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Email Address
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Onboarded Date
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Account Status
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Security Actions
              </TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers?.data.map((user) => (
              <TableRow key={user.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                  {user.id}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  #{user.tenant_id}
                </TableCell>
                <TableCell className="font-semibold text-gray-800 dark:text-gray-200">
                  {user.name}
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-500">
                  {user.email}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    color={user.is_active ? "success" : "failure"}
                    className="w-fit font-bold"
                  >
                    {user.is_active ? "ACTIVE" : "SUSPENDED"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="xs" color="gray" className="font-medium">
                    <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-gray-500" />{" "}
                    Manage Security ACL
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {paginatedUsers && paginatedUsers.meta && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:flex-row dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Showing sheet page{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {paginatedUsers.meta.current_page}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-700 dark:text-gray-300">
              {paginatedUsers.meta.last_page}
            </span>{" "}
            ({paginatedUsers.meta.total} total rows)
          </p>
          <Pagination
            currentPage={page}
            totalPages={paginatedUsers.meta.last_page}
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
