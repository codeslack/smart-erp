// Inside src/features/accounting/views/FinancialStatementsPane.tsx
import React, { useState } from "react";
import { Select } from "flowbite-react";
import { FileBarChart2 } from "lucide-react";
import { BalanceSheetView } from "./BalanceSheetView";
import { ProfitLossView } from "./ProfitLossView";
import { TrialBalanceView } from "./TrialBalanceView"; // FIXED: Imported atomic Trial Balance component view

export const FinancialStatementsPane: React.FC = () => {
  const [statementType, setStatementType] = useState<"BS" | "PL" | "TB">("BS");

  return (
    <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 font-sans shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 max-w-xs">
        <Select
          id="statement-selector"
          icon={FileBarChart2 as any}
          value={statementType}
          onChange={(e) => setStatementType(e.target.value as any)}
        >
          <option value="BS">Balance Sheet Statement</option>
          <option value="PL">Profit & Loss Statement</option>
          <option value="TB">Trial Balance Summary</option>
        </Select>
      </div>

      {/* Render the specialized sub-view blocks without data map interference */}
      {statementType === "BS" && <BalanceSheetView />}
      {statementType === "PL" && <ProfitLossView />}
      {/* FIXED: Activated dynamic Trial Balance sub-pane view */}
      {statementType === "TB" && <TrialBalanceView />}
    </div>
  );
};
