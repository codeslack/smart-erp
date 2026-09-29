// src/features/accounting/journals/views/JournalFormModal.tsx
import React, { useState, useEffect } from "react";
import {
  useCreateJournalMutation,
  useUpdateJournalMutation,
} from "../api/journalsApi";
import { JournalFormLines } from "./JournalFormLines";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Select,
  Spinner,
} from "flowbite-react";
import { getFieldError } from "@/utils/errorMapper";
import { InputError } from "@/components/InputError";
import { FileCode, Scale } from "lucide-react";
import { useGetChartOfAccountsQuery } from "../../api/accountingApi";
import type { JournalVoucher } from "../types/journalTypes";

export const JournalFormModal: React.FC<{
  show: boolean;
  onClose: () => void;
  editTarget: JournalVoucher | null;
}> = ({ show, onClose, editTarget }) => {
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<JournalVoucher["voucher_type"]>("journal");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [lines, setLines] = useState<any[]>([
    { chart_of_account_id: 0, debit: "0", credit: "0", description: "" },
    { chart_of_account_id: 0, debit: "0", credit: "0", description: "" },
  ]);

  const { data: accounts } = useGetChartOfAccountsQuery({ page: 1 });
  const [createJournal, { isLoading: isC, error: cErr }] =
    useCreateJournalMutation();
  const [updateJournal, { isLoading: isU, error: uErr }] =
    useUpdateJournalMutation();
  const error = editTarget ? uErr : cErr,
    isLoading = isC || isU;

  // FIXED: Eagerly inject and parse database records on edit click
  useEffect(() => {
    if (editTarget && show) {
      setDesc(editTarget.description ?? "");
      setType(editTarget.voucher_type);
      setDate(new Date(editTarget.entry_date).toISOString().split("T")[0]);
      setLines(
        editTarget.lines.map((l) => ({
          chart_of_account_id: l.chart_of_account_id,
          debit: String(parseFloat(l.debit)),
          credit: String(parseFloat(l.credit)),
          description: l.description,
        })),
      );
    } else if (show) {
      setDesc("");
      setType("journal");
      setDate(new Date().toISOString().split("T")[0]);
      setLines([
        { chart_of_account_id: 0, debit: "0", credit: "0", description: "" },
        { chart_of_account_id: 0, debit: "0", credit: "0", description: "" },
      ]);
    }
  }, [editTarget, show]);

  const totalDebits = lines.reduce(
    (acc, curr) => acc + (parseFloat(curr.debit) || 0),
    0,
  );
  const totalCredits = lines.reduce(
    (acc, curr) => acc + (parseFloat(curr.credit) || 0),
    0,
  );
  const isBalanced = totalDebits > 0 && totalDebits === totalCredits;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) return;
    const payload = {
      voucher_type: type,
      entry_date: new Date(date).toISOString(),
      description: desc.trim() || null,
      reference_type: null,
      reference_id: null,
      lines: lines.map((l) => ({
        chart_of_account_id: Number(l.chart_of_account_id),
        debit: parseFloat(l.debit) || 0,
        credit: parseFloat(l.credit) || 0,
        description: desc.trim() || null,
      })),
    };
    try {
      if (editTarget) {
        await updateJournal({
          id: editTarget.id,
          body: payload as any,
        }).unwrap();
      } else {
        await createJournal(payload as any).unwrap();
      }
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b p-4 dark:border-gray-700">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <FileCode className="text-primary-600" />{" "}
          {editTarget ? "Modify Journal Voucher" : "Record Journal Voucher"}
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Voucher Type</Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                sizing="sm"
              >
                <option value="journal">Journal</option>
                <option value="purchase">Purchase</option>
              </Select>
            </div>
            <div>
              <Label>Posting Date</Label>
              <TextInput
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                sizing="sm"
                required
              />
            </div>
          </div>
          <div>
            <Label>Memo Description</Label>
            <TextInput
              placeholder="Investment descriptions..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              sizing="sm"
              required
            />
            <InputError message={getFieldError(error, "description")} />
          </div>
          <JournalFormLines
            lines={lines}
            setLines={setLines}
            accounts={accounts?.data || []}
          />
          <div className="flex justify-between rounded-lg border bg-gray-50 p-2.5 font-mono text-xs font-bold text-gray-500 dark:bg-gray-700/30">
            <span className="flex items-center gap-1">
              <Scale size={13} /> D: ₹{totalDebits.toLocaleString("en-IN")}
            </span>
            <span
              className={
                isBalanced ? "font-black text-green-600" : "text-red-500"
              }
            >
              C: ₹{totalCredits.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex gap-2 border-t pt-3 dark:border-gray-700">
            <Button
              color="gray"
              size="sm"
              className="w-full"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="blue"
              size="sm"
              className="w-full"
              disabled={isLoading || !isBalanced}
            >
              {isLoading ? <Spinner size="sm" /> : "Post Voucher"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
