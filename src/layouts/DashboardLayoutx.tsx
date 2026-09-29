import React from "react";
import { Sidebar, Navbar, NavbarBrand } from "flowbite-react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useDarkMode } from "@/hooks/useDarkMode"; // FIXED: Loaded custom dark mode management engine hook
import {
  LayoutDashboard,
  ReceiptText,
  Landmark,
  Users2,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

export const DashboardLayoutx: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useDarkMode(); // FIXED: Instantiate theme controls

  const handleLogout = () => {
    localStorage.removeItem("erp_auth_token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar Component */}
      <Navbar
        fluid
        className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 fixed top-0 left-0 right-0 z-50 h-16 flex items-center"
      >
        <NavbarBrand as="div">
          <Link to="/dashboard" className="flex items-center">
            <span className="self-center whitespace-nowrap text-xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500">
              Smart ERP
            </span>
          </Link>
        </NavbarBrand>

        {/* Header Options Panel */}
        <div className="flex md:order-2 items-center gap-3">
          {/* FIXED: The Interactive Dark Mode Toggle Action Trigger */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
            title={isDark ? "Activate Light Mode" : "Activate Dark Mode"}
            aria-label="Toggle system color theme layout matrix"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            Workspace Active
          </div>
        </div>
      </Navbar>

      <div className="flex flex-1 pt-16">
        {/* Left Side Navigation Sidebar Grid */}
        <aside className="w-64 fixed top-16 bottom-0 left-0 z-40 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <Sidebar
            aria-label="ERP Enterprise Navigation"
            className="w-full !bg-transparent h-full"
          >
            <div className="h-full flex flex-col justify-between py-4">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <LayoutDashboard className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/invoicing"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <ReceiptText className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">Invoicing</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accounting"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Landmark className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">Accounting</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/users"
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <Users2 className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="ms-3">User Management</span>
                  </Link>
                </li>
              </ul>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center p-2 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 font-medium group text-left"
                >
                  <LogOut className="w-5 h-5 text-red-500 transition duration-75 group-hover:text-red-700" />
                  <span className="ms-3">Sign Out</span>
                </button>
              </div>
            </div>
          </Sidebar>
        </aside>

        {/* Dynamic Nested Route Rendering Screen Area */}
        <main className="flex-1 ml-64 p-6 min-h-[calc(100vh-64px)] overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
