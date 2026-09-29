// src/features/masters/units/views/UnitFormModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput, Textarea, Button, ToggleSwitch } from "flowbite-react";
import { unitFormSchema, type UnitFormValues } from "../utils/unitValidation";
import { useCreateUnitMutation, useUpdateUnitMutation } from "../api/unitsApi";
import { useAppDispatch } from "@/store/hooks";
import { showToast } from "@/store/notificationSlice";

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTarget: any | null;
}

export const UnitFormModal: React.FC<UnitModalProps> = ({ isOpen, onClose, editTarget }) => {
  const dispatch = useAppDispatch();
  const [createUnit, { isLoading: isCreating }] = useCreateUnitMutation();
  const [updateUnit, { isLoading: isUpdating }] = useUpdateUnitMutation();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
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

  const onSubmit = async (values: UnitFormValues) => {
    try {
      const payload = { ...values, description: values.description || null };
      if (editTarget?.uuid) {
        await updateUnit({ uuid: editTarget.uuid, data: payload }).unwrap();
        dispatch(showToast({ type: "success", message: "Measurement Unit updated successfully." }));
      } else {
        await createUnit(payload).unwrap();
        dispatch(showToast({ type: "success", message: "Measurement Unit created successfully." }));
      }
      onClose();
    } catch {
      dispatch(showToast({ type: "failure", message: "Failed to save measurement parameters." }));
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      <ModalHeader>{editTarget ? "Modify Measurement Unit" : "Add New Unit"}</ModalHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="space-y-4">
          <div>
            <Label htmlFor="unit_name">Unit Name *</Label>
            <TextInput id="unit_name" {...register("name")} placeholder="e.g. Kilograms, Pieces" color={errors.name ? "failure" : undefined} />
            <span className="text-xs text-red-500">{errors.name?.message}</span>
          </div>
          
          <div>
            <Label htmlFor="unit_desc">Description / Application Note</Label>
            <Textarea id="unit_desc" {...register("description")} rows={3} />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <ToggleSwitch checked={!!isActive} onChange={(val) => setValue("is_active", val)} label="Active Status" />
          </div>
        </ModalBody>
        <ModalFooter className="flex justify-end gap-2">
          <Button color="light" onClick={onClose}>Cancel</Button>
          <Button type="submit" color="blue" disabled={isCreating || isUpdating}>Save Unit</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};
