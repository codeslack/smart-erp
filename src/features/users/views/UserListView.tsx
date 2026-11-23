import React, { useEffect, useState } from 'react';
import { Button, TextInput, Select, Badge } from 'flowbite-react';
import { Search, RefreshCw, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { userService } from '../userService';
import { UserFormModal } from '../components/UserFormModal';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';
import type { UserRecord } from '@/types/user';
import type { PaginationMeta } from '@/types/api';
import type { TableColumn } from '@/types/common';

export const UserListView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Dialog state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchUsers = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await userService.getUsers({
        page,
        per_page: 15,
        search: searchTerm || undefined,
      });
      setUsers(res.data);
      setMeta(res.meta);
      setCurrentPage(page);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage);
  };

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await userService.deleteUser(userToDelete.uuid);
      dispatch(
        addToast({
          title: 'User Removed',
          message: `User ${userToDelete.name} was successfully removed.`,
          type: 'success',
        })
      );
      setUserToDelete(null);
      fetchUsers(currentPage);
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Delete Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    // Role filter
    if (roleFilter !== 'all') {
      const hasRole = u.roles?.some(
        (r) => r.toLowerCase() === roleFilter.toLowerCase()
      );
      if (!hasRole) return false;
    }

    // Search filter
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.code.toLowerCase().includes(term)
    );
  });

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'Administrator':
        return <Badge key={roleName} color="purple">{roleName}</Badge>;
      case 'Manager':
        return <Badge key={roleName} color="indigo">{roleName}</Badge>;
      case 'Accountant':
        return <Badge key={roleName} color="success">{roleName}</Badge>;
      case 'Sales Executive':
        return <Badge key={roleName} color="warning">{roleName}</Badge>;
      case 'Purchase Executive':
        return <Badge key={roleName} color="info">{roleName}</Badge>;
      case 'Warehouse Manager':
        return <Badge key={roleName} color="cyan">{roleName}</Badge>;
      default:
        return <Badge key={roleName} color="gray">{roleName}</Badge>;
    }
  };

  const columns: TableColumn<UserRecord>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (u: UserRecord) => (
        <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
          {u.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'User / Email',
      render: (u: UserRecord) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
          <p className="text-xs text-gray-500">{u.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (u: UserRecord) => u.phone || '—',
    },
    {
      key: 'roles',
      header: 'User Role / Type',
      render: (u: UserRecord) => (
        <div className="flex flex-wrap gap-1">
          {u.roles && u.roles.length > 0 ? (
            u.roles.map((role) => getRoleBadge(role))
          ) : (
            <span className="text-xs text-gray-400">Standard User</span>
          )}
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (u: UserRecord) =>
        u.is_active ? (
          <Badge color="success">Active</Badge>
        ) : (
          <Badge color="failure">Suspended</Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (u: UserRecord) => (
        <div className="flex justify-end gap-2">
          <Button
            size="xs"
            color="light"
            onClick={() => handleOpenEdit(u)}
            className="flex items-center gap-1"
          >
            <Edit2 className="h-3 w-3" />
            Edit
          </Button>
          <Button
            size="xs"
            color="failure"
            onClick={() => setUserToDelete(u)}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Access Control"
        subtitle="Manage company staff accounts, role-based access control, and tenant authorizations."
        breadcrumbs={[{ label: 'System' }, { label: 'Users & RBAC' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button color="light" onClick={() => fetchUsers(currentPage)} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleOpenCreate} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 mr-1" />
              New User
            </Button>
          </div>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Users"
          message={error}
          onRetry={() => fetchUsers(currentPage)}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <div className="relative w-full sm:w-80">
              <TextInput
                icon={Search}
                placeholder="Search by name, email, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-48"
              >
                <option value="all">All User Types / Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Accountant">Accountant</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Purchase Executive">Purchase Executive</option>
                <option value="Warehouse Manager">Warehouse Manager</option>
                <option value="Viewer">Viewer</option>
              </Select>
            </div>
          </div>

          <DataTable<UserRecord>
            columns={columns}
            data={filteredUsers}
            isLoading={isLoading}
            meta={meta}
            onPageChange={handlePageChange}
            keyExtractor={(u) => u.uuid}
            emptyTitle="No Users Found"
            emptyDescription="Invite team members and colleagues to collaborate in this tenant workspace."
          />
        </div>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchUsers(currentPage)}
        user={selectedUser}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        show={Boolean(userToDelete)}
        title="Remove User"
        message={`Are you sure you want to remove user "${userToDelete?.name}"? They will immediately lose access to this organization.`}
        confirmLabel="Delete User"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setUserToDelete(null)}
      />
    </div>
  );
};
