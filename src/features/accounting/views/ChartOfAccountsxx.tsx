import React, { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { openGlobalDrawer } from "@/store/uiSlice";
import { Button } from "flowbite-react";
import {
  Landmark,
  FileSpreadsheet,
  Plus,
  Library,
  FileText,
  FolderTree,
} from "lucide-react";
import { AccountsTablePane } from "./AccountsTablePane";
import { JournalEntriesPane } from "./JournalEntriesPane";
import { AccountGroupsPane } from "./AccountGroupsPane"; // Import new group view pane

export const ChartOfAccountsxx: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"GL" | "JE" | "AG">("GL"); // Added 'AG' key tab parameter state

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
            <Landmark className="text-primary-600 h-6 w-6" /> General Ledger
            Operations
          </h3>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button size="sm" color="gray" className="font-semibold">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button
            size="sm"
            color="blue"
            onClick={() =>
              dispatch(openGlobalDrawer({ contentType: "ADD_LEDGER" }))
            }
            className="font-semibold"
          >
            <Plus className="mr-2 h-4 w-4" /> Record Entry
          </Button>
        </div>
      </div>

      {/* Dynamic Tab Switchers Menu Row */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("GL")}
          className={`cursor-pointer border-b-2 px-2 pb-3 text-sm font-bold transition-all ${activeTab === "GL" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400"}`}
        >
          <div className="flex items-center gap-2">
            <Library size={16} /> Chart of Accounts
          </div>
        </button>
        <button
          onClick={() => setActiveTab("JE")}
          className={`cursor-pointer border-b-2 px-2 pb-3 text-sm font-bold transition-all ${activeTab === "JE" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400"}`}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} /> Journal Entries
          </div>
        </button>
        {/* FIXED: Dynamic New Account Groups Toggle Selection Link Button Row */}
        <button
          onClick={() => setActiveTab("AG")}
          className={`cursor-pointer border-b-2 px-2 pb-3 text-sm font-bold transition-all ${activeTab === "AG" ? "border-primary-600 text-primary-600" : "border-transparent text-gray-400"}`}
        >
          <div className="flex items-center gap-2">
            <FolderTree size={16} /> Account Groups
          </div>
        </button>
      </div>

      {/* Multiplex Section View Element Injections */}
      {activeTab === "GL" && <AccountsTablePane />}
      {activeTab === "JE" && <JournalEntriesPane />}
      {activeTab === "AG" && <AccountGroupsPane />}
    </div>
  );
};
