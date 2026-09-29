// src/components/ConfirmModal.tsx
import React from "react";
import { Modal, ModalBody, Button, ModalHeader } from "flowbite-react";
import { Trash2, AlertCircle } from "lucide-react";

interface ConfirmProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmProps> = ({
  show,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  return (
    <Modal show={show} onClose={onClose} size="sm" popup>
      <ModalHeader />
      <ModalBody className="p-6 text-center font-sans">
        <div className="mx-auto mb-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400">
          <AlertCircle size={28} />
        </div>
        <h3 className="mb-2 text-base font-black text-gray-900 dark:text-white">
          {title || "Confirm Structural Change"}
        </h3>
        <p className="mb-5 text-xs leading-relaxed font-medium text-gray-500 dark:text-gray-400">
          {message ||
            "Are you absolutely sure you want to perform this permanent transactional operation?"}
        </p>
        <div className="flex justify-center gap-3">
          <Button
            color="gray"
            size="xs"
            onClick={onClose}
            disabled={isLoading}
            className="font-semibold"
          >
            Cancel
          </Button>
          <Button
            color="failure"
            size="xs"
            onClick={onConfirm}
            disabled={isLoading}
            className="font-black text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {isLoading ? "Processing..." : "Confirm Action"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
