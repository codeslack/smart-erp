// src/features/masters/areas/views/AreaFormModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Button, ToggleSwitch } from "flowbite-react";
import { areaFormSchema, type AreaFormValues } from "../utils/areaValidation";
import { useCreateAreaMutation, useUpdateAreaMutation } from "../api/areasApi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget: any | null;
}

export const AreaFormModal: React.FC<AreaModalProps> = ({ isOpen, onClose, editTarget }) => {
  const dispatch = useAppDispatch();
  const [createArea, { isLoading: isCreating }] = useCreateAreaMutation();
  const [updateArea, { isLoading: isUpdating }] = useUpdateAreaMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AreaFormValues>({
    resolver: zodResolver(areaFormSchema),
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

  const onSubmit = async (values: AreaFormValues) => {
    try {
      const payload = { ...values, description: values.description || null };
      if (editTarget?.uuid) {
        await updateArea({ uuid: editTarget.uuid, data: payload }).unwrap();
        dispatch(showToast({ type: "success", message: "Area updated successfully." }));
      } else {
        await createArea(payload).unwrap();
        dispatch(showToast({ type: "success", message: "Area created successfully." }));
      }
      onClose();
    } catch {
      dispatch(showToast({ type: "failure", message: "Failed to save area parameters." }));
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>{editTarget ? "Modify Area" : "Add New Area"}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="area_name">Area Name *</Label>
            <TextInput id="area_name" {...register("name")} color={errors.name ? "failure" : undefined} />
            <span className="text-xs text-red-500">{errors.name?.message}</span>
          </div>
          
          <div>
            <Label htmlFor="area_desc">Description</Label>
            <Textarea id="area_desc" {...register("description")} rows={3} />
          </div>
          
          <div className="flex items-center gap-2 pt-2">
            <ToggleSwitch checked={!!isActive} onChange={(val) => setValue("is_active", val)} label="Active Status" />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button color="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isCreating || isUpdating}>Save Area</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
