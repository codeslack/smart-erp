import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
  Checkbox,
} from 'flowbite-react';
import { Loader2, AlertCircle } from 'lucide-react';
import { userService } from '../userService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { UserRecord, RoleRecord, UserFormData } from '@/types/user';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role_uuid: z.string().optional(),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: UserRecord | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(user?.uuid);

  const isAdmin = Boolean(
    currentUser?.roles?.some((r) => r.toLowerCase().includes('admin')) ||
    currentUser?.email === 'admin@example.com'
  );

  const isSelf = Boolean(
    user &&
    currentUser &&
    (user.uuid === currentUser.uuid || user.email?.toLowerCase() === currentUser.email?.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role_uuid: '',
      password: '',
      password_confirmation: '',
      is_active: true,
    },
  });

  // Fetch available tenant roles
  useEffect(() => {
    if (!isOpen) return;
    const fetchRoles = async () => {
      try {
        setIsLoadingRoles(true);
        const fetched = await userService.getRoles();
        setRoles(fetched);
      } catch (err: any) {
        console.error('Failed to load roles', err);
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [isOpen]);

  useEffect(() => {
    if (user && isOpen) {
      // Find matching role uuid from user.roles
      const userRoleName = user.roles?.[0];
      const matchedRole = roles.find((r) => r.name === userRoleName);

      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role_uuid: matchedRole?.uuid || '',
        password: '',
        password_confirmation: '',
        is_active: user.is_active ?? true,
      });
      setServerErrors({});
    } else if (isOpen) {
      reset({
        name: '',
        email: '',
        phone: '',
        role_uuid: '',
        password: '',
        password_confirmation: '',
        is_active: true,
      });
      setServerErrors({});
    }
  }, [user, isOpen, roles, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      // Enforce Admin creation policy
      if (!isEditing) {
        if (!isAdmin) {
          dispatch(
            addToast({
              title: 'Action Unauthorized',
              message: 'Only Administrators can create new users and assign roles.',
              type: 'error',
            })
          );
          setIsSubmitting(false);
          return;
        }

        if (!data.role_uuid) {
          setError('role_uuid', { message: 'Please select a user role / account type' });
          setIsSubmitting(false);
          return;
        }

        if (!data.password) {
          setError('password', { message: 'Password is required for new users' });
          setIsSubmitting(false);
          return;
        }
        if (data.password.length < 8) {
          setError('password', { message: 'Password must be at least 8 characters' });
          setIsSubmitting(false);
          return;
        }
        if (data.password !== data.password_confirmation) {
          setError('password_confirmation', { message: 'Password confirmation does not match' });
          setIsSubmitting(false);
          return;
        }
      } else if (data.password) {
        if (data.password.length < 8) {
          setError('password', { message: 'New password must be at least 8 characters' });
          setIsSubmitting(false);
          return;
        }
        if (data.password !== data.password_confirmation) {
          setError('password_confirmation', { message: 'Password confirmation does not match' });
          setIsSubmitting(false);
          return;
        }
      }

      const payload: UserFormData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        is_active: data.is_active,
      };

      // Assign role only if creating a new user or if an Administrator is modifying another user
      if (!isEditing && data.role_uuid) {
        payload.role_uuids = [data.role_uuid];
      } else if (isEditing && isAdmin && !isSelf && data.role_uuid) {
        payload.role_uuids = [data.role_uuid];
      }

      if (data.password) {
        payload.password = data.password;
        payload.password_confirmation = data.password_confirmation;
      }

      if (isEditing && user) {
        await userService.updateUser(user.uuid, payload);
        dispatch(
          addToast({
            title: 'User Updated',
            message: `${data.name} was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await userService.createUser(payload);
        dispatch(
          addToast({
            title: 'User Created',
            message: `User ${data.name} created with selected role.`,
            type: 'success',
          })
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const extracted = extractValidationErrors(err);
      if (extracted) {
        setServerErrors(extracted);
      } else {
        dispatch(
          addToast({
            title: 'Operation Failed',
            message: getErrorMessage(err),
            type: 'error',
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleError =
    errors.role_uuid?.message ||
    serverErrors.role_uuids?.[0] ||
    serverErrors['role_uuids.0']?.[0] ||
    serverErrors.roles?.[0];

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        {isEditing ? `Edit User: ${user?.name}` : 'Create / Invite New User'}
      </ModalHeader>
      <ModalBody>
        {!isEditing && !isAdmin && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Only Administrators have permission to create users and assign roles.</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="user-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="user-name"
              placeholder="e.g. John Doe"
              className="mt-1"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
            {serverErrors.name && (
              <p className="mt-1 text-xs text-red-600">{serverErrors.name[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="user-email"
                type="email"
                placeholder="john@company.com"
                className="mt-1"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
              {serverErrors.email && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.email[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="user-phone">Phone Number</Label>
              <TextInput
                id="user-phone"
                placeholder="+1 (555) 000-0000"
                className="mt-1"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* User Role / Account Type Selector */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="user-role-select">
                User Type / System Role {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              {isSelf && (
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Self Account
                </span>
              )}
            </div>
            <Select
              id="user-role-select"
              className="mt-1"
              disabled={isLoadingRoles || isSelf || (!isAdmin && isEditing)}
              {...register('role_uuid')}
            >
              <option value="">
                {isLoadingRoles ? 'Loading system roles...' : 'Select User Role / Type...'}
              </option>
              {roles.map((role) => (
                <option key={role.uuid} value={role.uuid}>
                  {role.name}
                </option>
              ))}
            </Select>
            {roleError && (
              <p className="mt-1 text-xs text-red-600">{roleError}</p>
            )}
            {isSelf ? (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                You cannot modify your own system role.
              </p>
            ) : !isAdmin && isEditing ? (
              <p className="mt-1 text-xs text-gray-500">
                Only Administrators can assign or change user roles.
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray-500">
                Determines system authorization, tenant access privileges, and module visibility.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="user-password">
                {isEditing ? 'New Password (Optional)' : 'Password *'}
              </Label>
              <TextInput
                id="user-password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
              {serverErrors.password && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.password[0]}</p>
              )}
            </div>
            <div>
              <Label htmlFor="user-password-confirm">
                {isEditing ? 'Confirm New Password' : 'Confirm Password *'}
              </Label>
              <TextInput
                id="user-password-confirm"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                {...register('password_confirmation')}
              />
              {errors.password_confirmation && (
                <p className="mt-1 text-xs text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox id="is_active" {...register('is_active')} />
            <Label htmlFor="is_active">Active Account (Allowed to authenticate)</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || (!isEditing && !isAdmin)}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create User'
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
