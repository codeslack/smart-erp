import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { useGetProductsQuery } from "@/features/masters/products/api/productsApi"; 

import { TopNavbar } from "./components/TopNavbar";
import { SidebarNavigation } from "./components/SidebarNavigation";
import { MobileOverlay } from "./components/MobileOverlay";
import { GlobalToastContainer } from "./GlobalToastContainer";
import { GlobalConfirmContainer } from "./GlobalConfirmContainer";
import { GlobalDrawerContainer } from "./GlobalDrawerContainer";

export const DashboardLayout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Fetch metrics for data badges
  const { data: productResponse, isLoading: isStatsLoading } = useGetProductsQuery({});

  const lowStockCount = (productResponse as any)?.data?.meta?.low_stock_total ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-sans transition-colors duration-200 dark:bg-gray-900">
      
      {/* 1. Header View Layer */}
      <TopNavbar 
        user={user} 
        isMobileSidebarOpen={isMobileSidebarOpen}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex flex-1 pt-16">
        
        {/* 2. Side Panel Navigation Tree */}
        <SidebarNavigation 
          userRole={user?.role || "staff"}
          isMobileSidebarOpen={isMobileSidebarOpen}
          isStatsLoading={isStatsLoading}
          lowStockCount={lowStockCount}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />

        {/* 3. Backdrop Click-Catcher Grid */}
        <MobileOverlay 
          isOpen={isMobileSidebarOpen} 
          onClose={() => setIsMobileSidebarOpen(false)} 
        />

        {/* 4. Core Window View Panel */}
        <main className="min-h-[calc(100vh-64px)] flex-1 overflow-y-auto bg-gray-50 p-6 transition-colors duration-200 md:ml-16 xl:ml-64 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>

      {/* Global State Modals */}
      <GlobalDrawerContainer />
      <GlobalToastContainer />
      <GlobalConfirmContainer />
    </div>
  );
};
