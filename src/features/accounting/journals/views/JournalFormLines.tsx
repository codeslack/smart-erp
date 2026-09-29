// src/features/accounting/journals/views/JournalFormLines.tsx
import React from "react";
import { Button, TextInput, Select } from "flowbite-react";
import { Plus, Trash2 } from "lucide-react";
import type { JournalLineItem } from "../types/journalTypes";
import type { ChartOfAccount } from "../../types";

interface LinesProps {
  lines: JournalLineItem[];
  setLines: React.Dispatch<React.SetStateAction<JournalLineItem[]>>;
  accounts: ChartOfAccount[];
}

export const JournalFormLines: React.FC<LinesProps> = ({
  lines,
  setLines,
  accounts,
}) => {
  const updateLine = (idx: number, key: keyof JournalLineItem, val: any) => {
    const updated = [...lines];
    updated[idx] = { ...updated[idx], [key]: val };
    setLines(updated);
  };

  const addLine = () =>
    setLines([
      ...lines,
      { chart_of_account_id: 0, debit: "0", credit: "0", description: "" },
    ]);
  const removeLine = (idx: number) =>
    setLines(lines.filter((_, i) => i !== idx));

  return (
    <div className="max-h-[30vh] space-y-3 overflow-y-auto pr-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase">
          Ledger Balancing Lines
        </span>
        <Button size="xs" color="gray" onClick={addLine}>
          <Plus size={12} className="mr-1" /> Add Line
        </Button>
      </div>
      {lines.map((line, idx) => (
        <div
          key={idx}
          className="relative space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
        >
          {lines.length > 2 && (
            <button
              type="button"
              onClick={() => removeLine(idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 size={13} />
            </button>
          )}
          <Select
            value={line.chart_of_account_id || ""}
            onChange={(e) =>
              updateLine(idx, "chart_of_account_id", Number(e.target.value))
            }
            required
            sizing="sm"
          >
            <option value="">Select Ledger Account...</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.account_code} - {a.account_name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              type="number"
              step="0.01"
              placeholder="Debit (₹)"
              value={line.debit}
              onChange={(e) => updateLine(idx, "debit", e.target.value)}
              sizing="sm"
              required
            />
            <TextInput
              type="number"
              step="0.01"
              placeholder="Credit (₹)"
              value={line.credit}
              onChange={(e) => updateLine(idx, "credit", e.target.value)}
              sizing="sm"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};
