import React from 'react';
import { Drawer } from 'flowbite-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { closeGlobalDrawer } from '@/store/uiSlice';
import { AddUserModalForm } from '@/features/user-management'; // Loaded our fresh atomic form component
import { AddAccountForm } from '@/features/accounting/views/AddAccountForm';

export const GlobalDrawerContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, contentType } = useAppSelector((state) => state.ui.drawer);

  const handleClose = () => { dispatch(closeGlobalDrawer()); };

  return (
    <Drawer open={isOpen} onClose={handleClose} position="right" className="w-96 p-6 bg-white dark:bg-gray-800">
      {contentType === 'ADD_USER' && <AddUserModalForm onClose={handleClose} />}
      {contentType === 'ADD_LEDGER' && <AddAccountForm onClose={handleClose} />}
    </Drawer>
  );
};
