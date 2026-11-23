import React from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'flowbite-react';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal show={show} size="md" onClose={onClose} popup>
      <ModalHeader />
      <ModalBody>
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
          <div className="flex justify-center gap-4">
            <Button
              color={isDestructive ? 'failure' : 'primary'}
              disabled={isLoading}
              onClick={onConfirm}
            >
              {isLoading ? 'Processing...' : confirmLabel}
            </Button>
            <Button
              color="gray"
              disabled={isLoading}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
