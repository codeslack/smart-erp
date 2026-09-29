import React, { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../api/categoriesApi";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Spinner,
  ToggleSwitch,
} from "flowbite-react";
import { getFieldError } from "@/utils/errorMapper";
import { InputError } from "@/components/InputError";
import { Layers } from "lucide-react";
import type { Category } from "../types/categoryTypes";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  editTarget: Category | null;
}

export const CategoryFormModalOld: React.FC<ModalProps> = ({
  show,
  onClose,
  editTarget,
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [createCategory, { isLoading: isCreating, error: createErr }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating, error: updateErr }] =
    useUpdateCategoryMutation();

  const activeError = editTarget ? updateErr : createErr;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editTarget) {
      setName(editTarget.name);
      setCode(editTarget.code);
      setDesc(editTarget.description || "");
      setIsActive(editTarget.is_active);
    } else {
      setName("");
      setCode("");
      setDesc("");
      setIsActive(true);
    }
  }, [editTarget, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      code,
      description: desc || null,
      is_active: isActive,
    };
    try {
      if (editTarget) {
        await updateCategory({ uuid: editTarget.uuid, body: payload }).unwrap();
      } else {
        await createCategory(payload).unwrap();
      }
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4 dark:border-gray-700">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Layers size={18} />{" "}
          {editTarget ? "Modify Category" : "Register Category Master"}
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          <div>
            <Label>Category Name</Label>
            <TextInput
              placeholder="e.g., Electronics, Raw Materials"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              color={getFieldError(activeError, "name") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(activeError, "name")} />
          </div>
          <div>
            <Label>System Code Alpha</Label>
            <TextInput
              placeholder="e.g., ELEC, RAW"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              color={getFieldError(activeError, "code") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(activeError, "code")} />
          </div>
          <div>
            <Label>Description / Notes</Label>
            <TextInput
              placeholder="Brief summary notes..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={isActive}
              label="Set Active Visibility status"
              onChange={setIsActive}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3 dark:border-gray-700">
            <Button
              color="gray"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" color="blue" size="sm" disabled={isLoading}>
              {isLoading ? (
                <Spinner size="sm" />
              ) : editTarget ? (
                "Apply Changes"
              ) : (
                "Save Category"
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
