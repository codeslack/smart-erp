import React from "react";
import { Link, useLocation } from "react-router-dom";
import { erpNavigationMap } from "@/config/navigationMenu";

interface SidebarNavigationProps {
  userRole: string;
  isMobileSidebarOpen: boolean;
  isStatsLoading: boolean;
  lowStockCount: number;
  onCloseMobileSidebar: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  userRole,
  isMobileSidebarOpen,
  isStatsLoading,
  lowStockCount,
  onCloseMobileSidebar
}) => {
  const location = useLocation();

  return (
    <aside 
      className={`scrolling-touch custom-scrollbar fixed top-16 bottom-0 left-0 z-40 w-64 overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 md:translate-x-0 dark:border-gray-700 dark:bg-gray-800
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="space-y-5 p-4 font-sans">
        <Link to="/dashboard" onClick={onCloseMobileSidebar} className="flex items-center">
          <span className="dark:text-primary-500 text-md self-center font-extrabold tracking-tight whitespace-nowrap text-gray-400">
            Dashboard
          </span>
        </Link>

        {erpNavigationMap.map((section, secIdx) => {
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
                  const isActive = item.path === "/dashboard" 
                    ? location.pathname === "/dashboard"
                    : location.pathname.startsWith(item.path);
                  
                  const isProductsLink = item.title === "Products"; 

                  return (
                    <li key={itemIdx}>
                      <Link
                        to={item.path}
                        onClick={onCloseMobileSidebar}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                          isActive
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700/60 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            size={15}
                            className={isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-400"}
                          />
                          <span>{item.title}</span>
                        </div>

                        {isProductsLink && (
                          isStatsLoading ? (
                            <div className="h-4 w-7 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                          ) : (
                            lowStockCount > 0 && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950/60 dark:text-red-400">
                                {lowStockCount}
                              </span>
                            )
                          )
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
