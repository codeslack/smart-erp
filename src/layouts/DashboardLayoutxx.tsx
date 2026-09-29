import React from "react";
import { Sidebar, Navbar, NavbarBrand, DarkThemeToggle } from "flowbite-react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { GlobalDrawerContainer } from "./GlobalDrawerContainer";
import {
  LayoutDashboard,
  ReceiptText,
  Landmark,
  Users2,
  LogOut,
} from "lucide-react";

export const DashboardLayoutxx: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("erp_auth_token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans transition-colors duration-200 dark:bg-gray-900">
      {/* Top Navbar Component */}
      <Navbar
        fluid
        className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <NavbarBrand as="div">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-primary-600 dark:text-primary-500 self-center text-xl font-extrabold tracking-tight whitespace-nowrap">
              Smart ERP
            </span>
          </Link>
        </NavbarBrand>

        {/* Header Right Actions Menu Option Layer */}
        <div className="flex items-center gap-3 md:order-2">
          <DarkThemeToggle />

          <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            Workspace Active
          </div>
        </div>
      </Navbar>

      <div className="flex flex-1 pt-16">
        {/* Left Side Navigation Sidebar Grid */}
        <aside className="fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Sidebar
            aria-label="ERP Enterprise Navigation"
            className="h-full w-full !bg-transparent"
          >
            <div className="flex h-full flex-col justify-between py-4">
              <ul className="space-y-2 font-medium">
                <li>
                  <Link
                    to="/dashboard"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <LayoutDashboard className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ms-3">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/invoicing"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <ReceiptText className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ms-3">Invoicing</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accounting"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Landmark className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ms-3">Accounting</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/users"
                    className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  >
                    <Users2 className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                    <span className="ms-3">User Management</span>
                  </Link>
                </li>
              </ul>

              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="group flex w-full items-center rounded-lg p-2 text-left font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-5 w-5 text-red-500 transition duration-75 group-hover:text-red-700" />
                  <span className="ms-3">Sign Out</span>
                </button>
              </div>
            </div>
          </Sidebar>
        </aside>

        {/* Dynamic Nested Route Rendering Screen Area */}
        <main className="ml-64 min-h-[calc(100vh-64px)] flex-1 overflow-y-auto bg-gray-50 p-6 transition-colors duration-200 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      <GlobalDrawerContainer />
    </div>
  );
};
