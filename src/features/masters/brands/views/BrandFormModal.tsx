// src/features/masters/brands/views/BrandFormModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Button, ToggleSwitch } from "flowbite-react";
import { brandFormSchema, type BrandFormValues } from "../utils/brandValidation";
import { useCreateBrandMutation, useUpdateBrandMutation } from "../api/brandsApi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget: any | null;
}

export const BrandFormModal: React.FC<BrandModalProps> = ({ isOpen, onClose, editTarget }) => {
  const dispatch = useAppDispatch();
  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
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

  const onSubmit = async (values: BrandFormValues) => {
    try {
      const payload = { ...values, description: values.description || null };
      if (editTarget?.uuid) {
        await updateBrand({ uuid: editTarget.uuid, data: payload }).unwrap();
        dispatch(showToast({ type: "success", message: "Brand updated successfully." }));
      } else {
        await createBrand(payload).unwrap();
        dispatch(showToast({ type: "success", message: "Brand created successfully." }));
      }
      onClose();
    } catch {
      dispatch(showToast({ type: "failure", message: "Failed to save brand parameters." }));
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>{editTarget ? "Modify Brand" : "Add New Brand"}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="brand_name">Brand Name *</Label>
            <TextInput id="brand_name" {...register("name")} color={errors.name ? "failure" : undefined} />
            <span className="text-xs text-red-500">{errors.name?.message}</span>
          </div>
          
          <div>
            <Label htmlFor="brand_desc">Description</Label>
            <Textarea id="brand_desc" {...register("description")} rows={3} />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <ToggleSwitch checked={!!isActive} onChange={(val) => setValue("is_active", val)} label="Active Status" />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button color="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isCreating || isUpdating}>Save Brand</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
