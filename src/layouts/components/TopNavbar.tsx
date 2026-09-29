import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  DarkThemeToggle,
  Dropdown,
  Avatar,
  DropdownHeader,
  DropdownItem,
  DropdownDivider,
} from "flowbite-react";
import { Menu, X, User, LogOut } from "lucide-react";

interface TopNavbarProps {
  user: any;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  user,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("erp_auth_token");
    navigate("/login");
  };

  return (
    <Navbar
      fluid
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
      theme={{
        root: {
          inner: {
            // Core structural properties go inside base
            base: "w-full flex items-center justify-between px-4 sm:px-6 mx-0 max-w-none",
            // Fluid states are wrapped nested under the fluid key to satisfy ts(2353)
            fluid: {
              on: "w-full flex items-center justify-between",
              off: "w-full flex items-center justify-between",
            },
          },
        },
      }}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <NavbarBrand as="div">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-primary-600 dark:text-primary-500 self-center text-xl font-extrabold tracking-tight whitespace-nowrap">
              Smart ERP
            </span>
          </Link>
        </NavbarBrand>
      </div>

      <div className="flex items-center gap-3">
        <DarkThemeToggle />

        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&color=7F9CF5&background=EBF4FF`}
              rounded
              size="sm"
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">
              {user?.name || "Active Session"}
            </span>
            <span className="block truncate text-xs font-medium text-gray-500 dark:text-gray-400">
              {user?.email || "user@smarterp.com"}
            </span>
          </DropdownHeader>

          <DropdownItem as={Link} to="/profile" icon={User}>
            My Profile
          </DropdownItem>

          <DropdownDivider />

          <DropdownItem
            onClick={handleLogout}
            className="text-red-600 dark:text-red-400"
            icon={LogOut}
          >
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
};
