// src/layouts/GlobalToastContainer.tsx

import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { hideToast } from "@/store/notificationSlice";
import { AlertToast } from "@/components/AlertToast";

export const GlobalToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, message, type } = useAppSelector(
    (state) => state.notification,
  );

  // Automated layout timer dismisses notifications cleanly after 4 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <AlertToast
      message={message}
      type={type}
      onClose={() => dispatch(hideToast())}
    />
  );
};
