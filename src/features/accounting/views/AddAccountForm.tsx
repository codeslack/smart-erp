// src/features/accounting/views/AddAccountForm.tsx
import React, { useState } from "react";
import {
  useGetChartOfAccountsQuery,
  useGetAccountGroupsQuery,
  useCreateChartOfAccountMutation,
} from "../api/accountingApi";
import { Button, Label, TextInput, Select, Spinner } from "flowbite-react";
import { getFieldError } from "@/utils/errorMapper";
import { InputError } from "@/components/InputError";
import { Landmark, Fingerprint, FolderTree, Tags } from "lucide-react";

export const AddAccountForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<
    "asset" | "liability" | "equity" | "income" | "expense"
  >("asset");
  const [groupId, setGroupId] = useState("");
  const [parentId, setParentId] = useState("");

  const { data: accounts } = useGetChartOfAccountsQuery({ page: 1 });
  const { data: groups } = useGetAccountGroupsQuery({ page: 1 });
  const [createAccount, { isLoading, error }] =
    useCreateChartOfAccountMutation();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount({
        account_group_id: groupId ? Number(groupId) : null, // Sent to backend payload mapping
        parent_id: parentId ? Number(parentId) : null, // Maps correctly as string/numeric references
        account_code: code,
        account_name: name,
        account_type: type,
        is_system: false,
        is_active: true,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("COA creation aborted:", err);
    }
  };

  return (
    // FIXED: Added an explicit 'pt-16' padding utility block row. This pushes the drawer layout elements down cleanly past the fixed Navbar boundary limits!
    <div className="flex h-full flex-col justify-between pt-16 font-sans">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 dark:border-gray-700">
          <Landmark size={20} className="text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Create Ledger Account
          </h3>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-1 block">
                <Label>Account Code</Label>
              </div>
              <TextInput
                placeholder="e.g., 1011"
                icon={Fingerprint as any}
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                color={
                  getFieldError(error, "account_code") ? "failure" : "gray"
                }
              />
              <InputError message={getFieldError(error, "account_code")} />
            </div>
            <div>
              <div className="mb-1 block">
                <Label>Account Type</Label>
              </div>
              <Select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
              >
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="equity">Equity</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </div>
          </div>
          <div>
            <div className="mb-1 block">
              <Label>Account Name Descriptor</Label>
            </div>
            <TextInput
              placeholder="e.g., SBI Bank"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              color={getFieldError(error, "account_name") ? "failure" : "gray"}
            />
            <InputError message={getFieldError(error, "account_name")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-1 block">
                <Label>Account Group</Label>
              </div>
              <Select
                id="group-id-select"
                icon={Tags as any}
                required
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <option value="">Select Group...</option>
                {groups?.data.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.code} - {g.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-1 block">
                <Label>Parent Classification</Label>
              </div>
              <Select
                id="parent-id-select"
                icon={FolderTree as any}
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">No Parent (Root)</option>
                {accounts?.data.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_code} - {acc.account_name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <Button
          color="gray"
          size="sm"
          className="w-full font-medium"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="blue"
          size="sm"
          className="w-full font-semibold"
          onClick={handleFormSubmit}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="sm" /> : "Register Account"}
        </Button>
      </div>
    </div>
  );
};
