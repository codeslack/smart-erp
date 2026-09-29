import React from "react";
import { GlobalToastContainer } from "./GlobalToastContainer";
import { GlobalConfirmContainer } from "./GlobalConfirmContainer";
import { erpNavigationMap } from "@/config/navigationMenu";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, DarkThemeToggle } from "flowbite-react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { GlobalDrawerContainer } from "./GlobalDrawerContainer";
import { LogOut } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const userRole = user?.role || "staff";

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
        <aside className="scrolling-touch custom-scrollbar fixed top-16 bottom-0 left-0 z-40 w-64 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-5 p-4 font-sans">
            <Link to="/dashboard" className="flex items-center">
              <span className="dark:text-primary-500 text-md self-center font-extrabold tracking-tight whitespace-nowrap text-gray-400">
                Dashboard
              </span>
            </Link>

            {erpNavigationMap.map((section, secIdx) => {
              // 1. Filter out section titles if an employee has zero clearances for all sub-links inside
              const visibleItems = section.items.filter((item) =>
                item.allowedRoles.includes(userRole),
              );
              if (visibleItems.length === 0) return null;

              return (
                <div key={secIdx} className="space-y-1">
                  <h4 className="text-primary-600 dark:text-primary-500 mt-3 mb-1.5 px-2 text-xs font-black tracking-wide uppercase">
                    # {section.sectionTitle}
                  </h4>
                  <ul className="space-y-0.5">
                    {visibleItems.map((item, itemIdx) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={itemIdx}>
                          <Link
                            to={item.path}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                              isActive
                                ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/60 dark:hover:text-white"
                            }`}
                          >
                            <item.icon
                              size={15}
                              className={
                                isActive
                                  ? "text-primary-600 dark:text-primary-400"
                                  : "text-gray-400"
                              }
                            />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            {/* Secure Sign Out Row */}
            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut size={15} />
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Nested Route Rendering Screen Area */}
        <main className="ml-64 min-h-[calc(100vh-64px)] flex-1 overflow-y-auto bg-gray-50 p-6 transition-colors duration-200 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      <GlobalDrawerContainer />
      <GlobalToastContainer />
      <GlobalConfirmContainer />
    </div>
  );
};
