// src/components/InputError.tsx
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputErrorProps {
  message: string | null;
}

export const InputError: React.FC<InputErrorProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 font-sans transition-all duration-200">
      <AlertCircle size={13} className="shrink-0" />
      <span>{message}</span>
    </div>
  );
};
