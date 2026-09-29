// src/features/masters/categories/views/CategoryFormModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Button, ToggleSwitch } from "flowbite-react";
import { categoryFormSchema, type CategoryFormValues } from "../utils/categoryValidation";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../api/categoriesApi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget: any | null;
}

export const CategoryFormModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, editTarget }) => {
  const dispatch = useAppDispatch();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", description: "", is_active: true },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (editTarget) {
      reset({
        name: editTarget.name,
        description: editTarget.description || "",
        is_active: !!editTarget.is_active,
      });
    } else {
      reset({ name: "", description: "", is_active: true });
    }
  }, [editTarget, reset, isOpen]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      const payload = { ...values, description: values.description || null };
      if (editTarget?.uuid) {
        await updateCategory({ uuid: editTarget.uuid, data: payload }).unwrap();
        dispatch(showToast({ type: "success", message: "Category updated successfully." }));
      } else {
        await createCategory(payload).unwrap();
        dispatch(showToast({ type: "success", message: "Category created successfully." }));
      }
      onClose();
    } catch {
      dispatch(showToast({ type: "failure", message: "Failed to save category parameters." }));
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>{editTarget ? "Modify Category" : "Add New Category"}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">

          <div>
            <Label htmlFor="cat_name">Category Name *</Label>
            <TextInput id="cat_name" {...register("name")} color={errors.name ? "failure" : undefined} />
            <span className="text-xs text-red-500">{errors.name?.message}</span>
          </div>
          
          <div>
            <Label htmlFor="cat_desc">Description</Label>
            <Textarea id="cat_desc" {...register("description")} rows={3} />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <ToggleSwitch checked={!!isActive} onChange={(val) => setValue("is_active", val)} label="Active Status" />
          </div>

        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button color="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isCreating || isUpdating}>Save Category</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
