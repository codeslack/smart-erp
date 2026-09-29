// 1. Notice all individual components are imported directly as flat names
import { 
  Navbar, 
  NavbarBrand, 
  DarkThemeToggle, 
  Dropdown, 
  Avatar, 
  DropdownHeader, 
  DropdownItem, 
  DropdownDivider 
} from "flowbite-react";
import { Link } from "react-router-dom";

export const NavigationBar = () => {
  return (
    <Navbar
      fluid
      className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800"
      theme={{
        root: {
          base: "w-full flex items-center justify-between px-4 sm:px-6",
        },
      }}
    >
      {/* Left Side */}
      <NavbarBrand as="div">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-primary-600 dark:text-primary-500 self-center text-xl font-extrabold tracking-tight whitespace-nowrap">
            Smart ERP
          </span>
        </Link>
      </NavbarBrand>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <DarkThemeToggle />
        
        {/* Profile Dropdown Menu */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar 
              alt="User settings" 
              img="https://flowbite.com" 
              rounded 
              size="sm"
            />
          }
        >
          {/* 2. Flat component used here */}
          <DropdownHeader>
            <span className="block text-sm font-semibold text-gray-900 dark:text-white">Admin User</span>
            <span className="block truncate text-xs font-medium text-gray-500 dark:text-gray-400">admin@smarterp.com</span>
          </DropdownHeader>
          
          {/* 3. Replaced Dropdown.Item with DropdownItem */}
          <DropdownItem as={Link} to="/profile">My Profile</DropdownItem>
          <DropdownItem as={Link} to="/settings">Account Settings</DropdownItem>
          
          <DropdownDivider />
          
          <DropdownItem className="text-red-600 dark:text-red-400">Sign out</DropdownItem>
        </Dropdown>
      </div>
    </Navbar>
  );
};
