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
  Textarea,
  Checkbox,
} from 'flowbite-react';
import { Loader2 } from 'lucide-react';
import { masterDataService, type AreaRecord, type AreaFormData } from '../masterDataService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

const areaSchema = z.object({
  name: z.string().min(2, 'Area name must be at least 2 characters'),
  description: z.string().optional(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof areaSchema>;

interface AreaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  area?: AreaRecord | null;
}

export const AreaFormModal: React.FC<AreaFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  area,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(area?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (area && isOpen) {
      reset({
        name: area.name || '',
        description: area.description || '',
        is_active: area.is_active ?? true,
      });
      setServerErrors({});
    } else if (isOpen) {
      reset({
        name: '',
        description: '',
        is_active: true,
      });
      setServerErrors({});
    }
  }, [area, isOpen, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: AreaFormData = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        is_active: data.is_active,
      };

      if (isEditing && area) {
        await masterDataService.updateArea(area.uuid, payload);
        dispatch(
          addToast({
            title: 'Area Updated',
            message: `Area "${data.name}" was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await masterDataService.createArea(payload);
        dispatch(
          addToast({
            title: 'Area Created',
            message: `Area "${data.name}" has been created.`,
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
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        {isEditing ? `Edit Area: ${area?.name}` : 'Create New Area / Territory'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="area-name">
              Area / Territory Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="area-name"
              placeholder="e.g. North Zone, Downtown Hub"
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

          <div>
            <Label htmlFor="area-desc">Description</Label>
            <Textarea
              id="area-desc"
              placeholder="Regional territory boundaries or coverage description..."
              rows={3}
              className="mt-1"
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox id="area-is-active" {...register('is_active')} />
            <Label htmlFor="area-is-active">Active Area (Available for assignment)</Label>
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
                'Create Area'
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
