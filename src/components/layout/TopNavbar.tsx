import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
  Avatar,
  Badge,
} from 'flowbite-react';
import { Menu, Sun, Moon, LogOut, User as UserIcon, Shield, Building2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleSidebar, toggleTheme } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { addNotification } from '@/features/notifications/notificationSlice';
import { useNavigate } from 'react-router-dom';

export const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, tenant } = useAppSelector((state) => state.auth);
  const { themeMode } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      addNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      })
    );
    navigate('/login');
  };

  return (
    <Navbar fluid className="border-b border-gray-200 bg-white px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => dispatch(toggleSidebar())}
          className="mr-3 cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
        >
          <Menu className="h-6 w-6" />
        </button>

        <NavbarBrand href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">
            SE
          </div>
          <span className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Smart <span className="text-primary-600">ERP</span>
          </span>

          {tenant && (
            <div className="hidden sm:flex items-center ml-3 pl-3 border-l border-gray-200 dark:border-gray-700">
              <Badge color="info" className="flex items-center gap-1 font-semibold text-xs">
                <Building2 className="h-3 w-3 mr-1 inline" />
                {tenant.name}
              </Badge>
            </div>
          )}
        </NavbarBrand>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Mode Toggle Button */}
        <button
          type="button"
          aria-label="Toggle theme mode"
          onClick={() => dispatch(toggleTheme())}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <div className="flex cursor-pointer items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Avatar
                alt={user?.name || 'User'}
                placeholderInitials={user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                rounded
                size="sm"
              />
              <span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:inline-block">
                {user?.name || 'Administrator'}
              </span>
            </div>
          }
        >
          <DropdownHeader>
            <span className="block text-sm font-bold text-gray-900 dark:text-white">
              {user?.name || 'Administrator'}
            </span>
            <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
              {user?.email || 'admin@example.com'}
            </span>
            {tenant && (
              <span className="mt-1 block truncate text-xs font-medium text-primary-600 dark:text-primary-400">
                Company: {tenant.name}
              </span>
            )}
            {user?.roles && user.roles.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                <Shield className="h-3.5 w-3.5" />
                <span>{user.roles.join(', ')}</span>
              </div>
            )}
          </DropdownHeader>
          <DropdownItem icon={UserIcon} onClick={() => navigate('/settings')}>
            Profile & Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} onClick={handleLogout} className="text-red-600 dark:text-red-400">
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
};
