import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { categorySchema } from '../productValidation';
import type { CategoryFormData } from '../productValidation';
import { productService } from '../productService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { Category, CreateCategoryRequest } from '@/types/product';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(category?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setServerErrors({});
      if (category) {
        reset({
          name: category.name || '',
          code: category.code || '',
          description: category.description || '',
          is_active: category.is_active ?? true,
        });
      } else {
        reset({
          name: '',
          code: '',
          description: '',
          is_active: true,
        });
      }
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: CreateCategoryRequest = {
        name: data.name.trim(),
        code: data.code?.trim() || null,
        description: data.description?.trim() || null,
        is_active: data.is_active,
      };

      if (isEditing && category?.uuid) {
        await productService.updateCategory(category.uuid, payload);
        dispatch(
          addToast({
            title: 'Category Updated',
            message: `Category ${data.name} was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await productService.createCategory(payload);
        dispatch(
          addToast({
            title: 'Category Created',
            message: `Category ${data.name} was successfully created.`,
            type: 'success',
          })
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const fieldErrors = extractValidationErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setServerErrors(fieldErrors);
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
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        {isEditing ? 'Edit Category' : 'Create New Category'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="cat-name"
              placeholder="e.g. Finished Goods, Hardware"
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
            <Label htmlFor="cat-code">Category Code</Label>
            <TextInput
              id="cat-code"
              placeholder="e.g. CAT-001"
              className="mt-1 font-mono"
              {...register('code')}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              placeholder="Classification details"
              rows={2}
              className="mt-1"
              {...register('description')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="cat-active" {...register('is_active')} />
            <Label htmlFor="cat-active" className="cursor-pointer">
              Category is Active
            </Label>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button color="gray" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
