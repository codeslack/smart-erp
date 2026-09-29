import React, { useState } from "react";
import { useGetAccountGroupsQuery } from "../api/accountingApi";
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
} from "flowbite-react";
import { FolderKanban } from "lucide-react";

export const AccountGroupsPane: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: groups, isLoading } = useGetAccountGroupsQuery({ page });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <Spinner size="lg" color="info" />
      </div>
    );

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table hoverable>
          <TableHead>
            <TableRow>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Group ID
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Group Name Descriptor
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                System Code Alpha
              </TableHeadCell>
              <TableHeadCell className="bg-gray-50 dark:bg-gray-700">
                Tenant Namespace
              </TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {groups?.data.map((grp) => (
              <TableRow key={grp.id} className="bg-white dark:bg-gray-800">
                <TableCell className="font-mono text-xs font-bold text-gray-400">
                  #{grp.id}
                </TableCell>
                <TableCell className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
                  <FolderKanban size={16} className="text-indigo-500" />{" "}
                  {grp.name}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  <Badge color="purple" className="w-fit">
                    {grp.code}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400">
                  Scope ID: {grp.tenant_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {groups?.meta && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-400">
            Page {groups.meta.current_page} of {groups.meta.last_page} (
            {groups.meta.total} root groups)
          </p>
          <Pagination
            currentPage={page}
            totalPages={groups.meta.last_page}
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
