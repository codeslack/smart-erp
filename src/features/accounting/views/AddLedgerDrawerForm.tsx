import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { Landmark } from "lucide-react";

export const AddLedgerDrawerForm: React.FC<{
  onClose: () => void;
  payload: any;
}> = ({ onClose, payload }) => {
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting entry using payload configuration:", payload);
    onClose();
  };

  return (
    <div className="flex h-full flex-col justify-between font-sans">
      <div>
        <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4 dark:border-gray-700">
          <Landmark className="text-primary-600 h-5 w-5" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Record Journal Entry
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="mb-1 block">
              <Label>Reference ID</Label>
            </div>
            <TextInput
              placeholder="JE-2026-09"
              required
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-1 block">
              <Label>Entry Memo</Label>
            </div>
            <TextInput
              placeholder="SaaS platform adjustments"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
        <Button
          color="gray"
          size="sm"
          className="w-full font-medium"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          color="blue"
          size="sm"
          className="w-full font-semibold"
          onClick={handleSubmit}
        >
          Post Entry
        </Button>
      </div>
    </div>
  );
};
