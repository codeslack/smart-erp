// src/features/accounting/journals/views/JournalFormModal.tsx
import React, { useState, useEffect } from "react";
import {
  useCreateJournalMutation,
  useUpdateJournalMutation,
} from "../api/journalsApi";
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
import { FileCode, Calendar, FileText } from "lucide-react";
import type { JournalVoucher } from "../types/journalTypes";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  editTarget: JournalVoucher | null;
}

export const JournalFormModalTest: React.FC<ModalProps> = ({
  show,
  onClose,
  editTarget,
}) => {
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"journal" | "purchase" | "sale">("journal");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [createJournal, { isLoading: isCreating, error: createErr }] =
    useCreateJournalMutation();
  const [updateJournal, { isLoading: isUpdating, error: updateErr }] =
    useUpdateJournalMutation();

  const activeError = editTarget ? updateErr : createErr;
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (editTarget) {
      setDesc(editTarget.description);
      setType(editTarget.voucher_type as any);
      setDate(new Date(editTarget.entry_date).toISOString().split("T")[0]);
    } else {
      setDesc("");
      setType("journal");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editTarget, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      description: desc,
      voucher_type: type,
      entry_date: date,
      lines: editTarget?.lines || [],
    };
    try {
      if (editTarget) {
        await updateJournal({ id: editTarget.id, body: payload }).unwrap();
      } else {
        await createJournal(payload).unwrap();
      }
      onClose();
    } catch {}
  };

  return (
    <Modal show={show} onClose={onClose} size="md" popup>
      <ModalHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
        <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
          <FileCode size={20} className="text-primary-600" />
          {editTarget ? "Modify Voucher Record" : "Record Journal Voucher"}
        </span>
      </ModalHeader>
      <ModalBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 block">
                <Label>Voucher Type</Label>
              </div>
              <Select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                disabled={isLoading}
              >
                <option value="journal">Journal</option>
                <option value="purchase">Purchase</option>
                <option value="sale">Sale</option>
              </Select>
            </div>
            <div>
              <div className="mb-1 block">
                <Label>Posting Date</Label>
              </div>
              <TextInput
                type="date"
                icon={Calendar as any}
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div>
            <div className="mb-1 block">
              <Label>Voucher Description Memo</Label>
            </div>
            <TextInput
              placeholder="Describe transactional ledger entry adjusting context..."
              icon={FileText as any}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              disabled={isLoading}
              color={
                getFieldError(activeError, "description") ? "failure" : "gray"
              }
            />
            <InputError message={getFieldError(activeError, "description")} />
          </div>
          <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
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
                "Apply Modification"
              ) : (
                "Post Voucher"
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
