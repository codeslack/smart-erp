// src/features/masters/suppliers/views/SupplierFormModal.tsx
import React, { useState, useEffect } from "react";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../api/suppliersApi";
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
import { Truck } from "lucide-react";

export const SupplierFormModal: React.FC<{
  show: boolean;
  onClose: () => void;
  editTarget: any;
}> = ({ show, onClose, editTarget }) => {
  const [name, setName] = useState(""),
    [code, setCode] = useState(""),
    [pName, setPName] = useState(""),
    [phone, setPhone] = useState(""),
    [email, setEmail] = useState(""),
    [address, setAddress] = useState(""),
    [taxNum, setTaxNum] = useState(""),
    [isActive, setIsActive] = useState(true);
  const [createSupplier, { isLoading: isC, error: cErr }] =
      useCreateSupplierMutation(),
    [updateSupplier, { isLoading: isU, error: uErr }] =
      useUpdateSupplierMutation();
  const error = editTarget ? uErr : cErr,
    isLoading = isC || isU;

  useEffect(() => {
    if (editTarget) {
      setName(editTarget.name);
      setCode(editTarget.code || "");
      setPName(editTarget.contact_person || "");
      setPhone(editTarget.phone || "");
      setEmail(editTarget.email || "");
      setAddress(editTarget.address || "");
      setTaxNum(editTarget.tax_number || "");
      setIsActive(editTarget.is_active);
    } else {
      setName("");
      setCode("");
      setPName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setTaxNum("");
      setIsActive(true);
    }
  }, [editTarget, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name,
      code: code.trim() || null,
      contact_person: pName.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      address: address.trim() || null,
      tax_number: taxNum.trim() || null,
      is_active: isActive,
    };
    if (editTarget) await updateSupplier({ id: editTarget.id, body }).unwrap();
    else await createSupplier(body).unwrap();
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose} size="lg" popup>
      <ModalHeader className="border-b p-4 dark:border-gray-700">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <Truck size={18} />{" "}
          {editTarget ? "Modify Supplier" : "Register Supplier"}
        </span>
      </ModalHeader>
      <ModalBody className="max-h-[75vh] overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-3 font-sans">
          <div>
            <Label>Supplier / Firm Name</Label>
            <TextInput
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              color={getFieldError(error, "name") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(error, "name")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Supplier Code</Label>
              <TextInput
                placeholder="SUPP-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <Label>Tax/GST Number</Label>
              <TextInput
                placeholder="27BBBBB2222B1Z1"
                value={taxNum}
                onChange={(e) => setTaxNum(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <div>
            <Label>Contact Person</Label>
            <TextInput
              value={pName}
              onChange={(e) => setPName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Phone</Label>
              <TextInput
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label>Email</Label>
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Warehouse Address</Label>
            <TextInput
              placeholder="Street, City, State"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <ToggleSwitch
              checked={isActive}
              label="Set Active Visibility Status"
              onChange={setIsActive}
            />
          </div>
          <div className="flex justify-end gap-2 border-t pt-3">
            <Button color="gray" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" color="blue" size="sm" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : "Save Supplier"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
