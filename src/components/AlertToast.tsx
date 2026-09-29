// src/components/AlertToast.tsx
import React from "react";
import { Toast, ToastToggle } from "flowbite-react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "failure" | "info";
  onClose: () => void;
}

export const AlertToast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
}) => {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
    },
    failure: {
      icon: AlertTriangle,
      bg: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
    },
    info: {
      icon: Info,
      bg: "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200",
    },
  };

  const active = config[type];

  return (
    // Fixed absolute positioning safely anchors notifications to the bottom-right workspace canvas
    <div className="fixed right-5 bottom-5 z-[60] font-sans shadow-lg transition-all duration-300">
      <Toast>
        <div
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active.bg}`}
        >
          <active.icon size={18} />
        </div>
        <div className="ml-3 text-xs font-bold text-gray-600 dark:text-gray-300">
          {message}
        </div>
        <ToastToggle onDismiss={onClose} />
      </Toast>
    </div>
  );
};
