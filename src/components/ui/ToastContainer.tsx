import React, { useEffect } from 'react';
import { Toast } from 'flowbite-react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { removeNotification, type NotificationItem } from '@/features/notifications/notificationSlice';

const ToastItemComponent: React.FC<{ item: NotificationItem }> = ({ item }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (item.duration && item.duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(item.id));
      }, item.duration);
      return () => clearTimeout(timer);
    }
  }, [dispatch, item.duration, item.id]);

  const getIcon = () => {
    switch (item.type) {
      case 'success':
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
      case 'error':
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <AlertCircle className="h-5 w-5" />
          </div>
        );
      case 'warning':
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200">
            <Info className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <Toast className="w-full max-w-xs shadow-lg">
      {getIcon()}
      <div className="ml-3 text-sm font-normal">
        {item.title && <div className="font-semibold text-gray-900 dark:text-white">{item.title}</div>}
        <div className="text-gray-600 dark:text-gray-300">{item.message}</div>
      </div>
      <button
        type="button"
        className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
        aria-label="Close"
        onClick={() => dispatch(removeNotification(item.id))}
      >
        <X className="h-4 w-4" />
      </button>
    </Toast>
  );
};

export const ToastContainer: React.FC = () => {
  const notifications = useAppSelector((state) => state.notifications.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-5 top-5 z-50 flex flex-col gap-3">
      {notifications.map((item) => (
        <ToastItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};
