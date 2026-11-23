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
  Checkbox,
} from 'flowbite-react';
import { Loader2 } from 'lucide-react';
import { userService } from '../userService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { UserRecord, UserFormData } from '@/types/user';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(user?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
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
        password: '',
        password_confirmation: '',
        is_active: true,
      });
      setServerErrors({});
    }
  }, [user, isOpen, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: UserFormData = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        is_active: data.is_active,
      };

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
            message: `${data.name} has been invited/created.`,
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

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        {isEditing ? `Edit User: ${user?.name}` : 'Invite / Create New User'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="user-name">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="user-name"
              placeholder="e.g. Jane Doe"
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
                placeholder="jane@company.com"
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
              <Label htmlFor="user-password-confirm">Confirm Password</Label>
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
            <Label htmlFor="is_active">Active Account (Allowed to log in)</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button color="gray" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
