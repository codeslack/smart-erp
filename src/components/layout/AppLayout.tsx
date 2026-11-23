import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { useAppSelector } from '@/app/hooks';

export const AppLayout: React.FC = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <ToastContainer />
      <header className="fixed top-0 left-0 right-0 z-40">
        <TopNavbar />
      </header>
      <Sidebar />
      <main
        className={`pt-14 transition-all duration-200 ${
          sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
