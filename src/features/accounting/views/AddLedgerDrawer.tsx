import React, { useState } from "react";
import type { FC } from "react";
import { Drawer, Button, Label, TextInput, Select } from "flowbite-react";
import { Landmark, Plus, Trash2 } from "lucide-react";

interface AddLedgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLedgerDrawer: React.FC<AddLedgerDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [reference, setReference] = useState("");
  const [description, setDescription] = useState("");

  interface JournalLine {
    account_id: string;
    debit: number;
    credit: number;
  }

  const [lines, setLines] = useState<JournalLine[]>([
    { account_id: "1010", debit: 0, credit: 0 },
    { account_id: "4000", debit: 0, credit: 0 },
  ]);

  const addTransactionLine = () => {
    setLines([...lines, { account_id: "1200", debit: 0, credit: 0 }]);
  };

  const removeTransactionLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateTransactionLine = (
    index: number,
    field: keyof JournalLine,
    value: string | number,
  ) => {
    setLines((prevLines) =>
      prevLines.map((line, idx) =>
        idx !== index
          ? line
          : {
              ...line,
              account_id:
                field === "account_id" ? String(value) : line.account_id,
              debit: field === "debit" ? Number(value) : line.debit,
              credit: field === "credit" ? Number(value) : line.credit,
            },
      ),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[ERP Journal Entry Submission Data]:", {
      reference,
      description,
      lines,
    });
    onClose();
  };

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      position="right"
      className="w-96 bg-white p-6 dark:bg-gray-800"
    >
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
                <Label>Reference Identifier</Label>
              </div>
              <TextInput
                id="ref-id"
                placeholder="e.g., JE-2026-09"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div>
              <div className="mb-1 block">
                <Label>Entry Memo Descriptor</Label>
              </div>
              <TextInput
                id="memo-desc"
                placeholder="Platform subscription adjustments"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Ledger Entry Lines
                </span>
                <Button size="xs" color="gray" onClick={addTransactionLine}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Line
                </Button>
              </div>

              <div className="max-h-[40vh] space-y-3 overflow-y-auto pr-1">
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="relative space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
                  >
                    {lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeTransactionLine(idx)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <Select
                      value={line.account_id}
                      onChange={(e) =>
                        updateTransactionLine(idx, "account_id", e.target.value)
                      }
                      sizing="sm"
                      icon={Landmark as FC<React.ComponentProps<"svg">>}
                    >
                      <option value="1010">1010 - Operating Bank</option>
                      <option value="1200">1200 - Accounts Receivable</option>
                      <option value="4000">4000 - SaaS Platform Revenue</option>
                    </Select>
                    <div className="grid grid-cols-2 gap-2">
                      <TextInput
                        type="number"
                        placeholder="Debit"
                        sizing="sm"
                        required
                        value={line.debit}
                        onChange={(e) =>
                          updateTransactionLine(idx, "debit", e.target.value)
                        }
                      />
                      <TextInput
                        type="number"
                        placeholder="Credit"
                        sizing="sm"
                        required
                        value={line.credit}
                        onChange={(e) =>
                          updateTransactionLine(idx, "credit", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
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
    </Drawer>
  );
};
