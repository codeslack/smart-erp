import React, { useState, useEffect } from "react";
import {
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
} from "../api/warehousesApi";
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
import { Home } from "lucide-react";
import type { Warehouse } from "../types/warehouseTypes";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  editTarget: Warehouse | null;
}

export const WarehouseFormModal: React.FC<ModalProps> = ({
  show,
  onClose,
  editTarget,
}) => {
  const [code, setCode] = useState("WH-01");
  const [name, setName] = useState("Central Hub");
  const [phone, setPhone] = useState("9876543210");
  const [email, setEmail] = useState("wh@company.com");
  const [address, setAddress] = useState("Plot 45, Industrial Area");
  const [isActive, setIsActive] = useState(true);

  const [createWarehouse, { isLoading: isCreating, error: createErr }] =
    useCreateWarehouseMutation();
  const [updateWarehouse, { isLoading: isUpdating, error: updateErr }] =
    useUpdateWarehouseMutation();

  const activeError = editTarget ? updateErr : createErr;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editTarget) {
      setCode(editTarget.code);
      setName(editTarget.name);
      setPhone(editTarget.phone || "");
      setEmail(editTarget.email || "");
      setAddress(editTarget.address || "");
      setIsActive(editTarget.is_active);
    } else {
      setCode("");
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setIsActive(true);
    }
  }, [editTarget, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code,
      name,
      phone: phone || null,
      email: email || null,
      address: address || null,
      is_active: isActive,
    };
    try {
      if (editTarget) {
        await updateWarehouse({ uuid: editTarget.uuid, body: payload }).unwrap();
      } else {
        await createWarehouse(payload).unwrap();
      }
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4 dark:border-gray-700">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Home size={18} />{" "}
          {editTarget ? "Modify Warehouse" : "Register Warehouse Master"}
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Warehouse Code</Label>
              <TextInput
                placeholder="WH-01"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                color={getFieldError(activeError, "code") ? "failure" : "gray"}
              />
              <InputError message={getFieldError(activeError, "code")} />
            </div>
            <div>
              <Label>Warehouse Name</Label>
              <TextInput
                placeholder="Central Hub"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                color={getFieldError(activeError, "name") ? "failure" : "gray"}
              />
              <InputError message={getFieldError(activeError, "name")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Contact Phone</Label>
              <TextInput
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label>Contact Email</Label>
              <TextInput
                type="email"
                placeholder="wh@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <Label>Physical Address</Label>
            <TextInput
              placeholder="Plot 45, Industrial Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ToggleSwitch
              checked={isActive}
              label="Set Active Visibility Status"
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
                "Save Warehouse"
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
