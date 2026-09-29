import React, { useState } from "react";
import type { FC } from "react";
import { useCreateUserMutation } from "../api/userManagementApi";
import { Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import { getFieldError } from "@/utils/errorMapper";
import { InputError } from "@/components/InputError";
import { UserPlus, Mail, Shield, User } from "lucide-react";

interface AddUserModalFormProps {
  onClose: () => void;
}

export const AddUserModalForm: React.FC<AddUserModalFormProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Staff Operator");
  const [createUser, { isLoading, error }] = useCreateUserMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ name, email, role, is_active: true } as any).unwrap();
      setName("");
      setEmail("");
      setRole("Staff Operator");
      onClose(); 
    } catch (err) {
      console.error("Personnel onboarding assignment failed:", err);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between font-sans">
      <div>
        <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
          <UserPlus size={20} className="text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Onboard System Employee</h3>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <div className="mb-2 block"><Label>Full Name</Label></div>
            <TextInput
              id="personnel-name"
              type="text"
              placeholder="John Doe"
              icon={User as FC<React.ComponentProps<"svg">>}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              color={getFieldError(error, "name") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(error, "name")} />
          </div>

          <div>
            <div className="mb-2 block"><Label>Corporate Email</Label></div>
            <TextInput
              id="personnel-email"
              type="email"
              placeholder="j.doe@company.com"
              icon={Mail as FC<React.ComponentProps<"svg">>}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              color={getFieldError(error, "email") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(error, "email")} />
          </div>

          <div>
            <div className="mb-2 block"><Label>Assigned Security Profile Role</Label></div>
            <Select
              id="personnel-role"
              icon={Shield as FC<React.ComponentProps<"svg">>}
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="Staff Operator">Staff Operator</option>
              <option value="Internal Auditor">Internal Auditor</option>
              <option value="System Administrator">System Administrator</option>
              <option value="Chief Financial Officer">Chief Financial Officer</option>
            </Select>
          </div>
        </form>
      </div>

      <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-6">
        <Button color="gray" size="sm" className="w-full font-medium" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" color="blue" size="sm" className="w-full font-semibold" onClick={handleFormSubmit} disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : "Onboard User"}
        </Button>
      </div>
    </div>
  );
};
