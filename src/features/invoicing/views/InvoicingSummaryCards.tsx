// src/features/invoicing/views/InvoicingSummaryCards.tsx
import React from "react";
import { Card } from "flowbite-react";
import {
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

interface SummaryProps {
  summary?: {
    gross_receivables: number;
    collected_funds: number;
    overdue_arrears: number;
    draft_allocations: number;
  };
}

export const InvoicingSummaryCards: React.FC<SummaryProps> = ({ summary }) => {
  const metrics = [
    {
      label: "Gross Receivables",
      value: summary?.gross_receivables || 185000,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
      icon: ArrowUpRight,
    },
    {
      label: "Collected Funds",
      value: summary?.collected_funds || 125000,
      color: "text-green-600 bg-green-50 dark:bg-green-950/30",
      icon: CheckCircle2,
    },
    {
      label: "Overdue Arrears",
      value: summary?.overdue_arrears || 45000,
      color: "text-red-600 bg-red-50 dark:bg-red-950/30",
      icon: AlertCircle,
    },
    {
      label: "Draft Allocations",
      value: summary?.draft_allocations || 15000,
      color: "text-gray-500 bg-gray-50 dark:bg-gray-700/40",
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 font-sans sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((card, idx) => (
        <Card
          key={idx}
          className="border border-gray-100 shadow-sm dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                {card.label}
              </p>
              {/* FIXED: Formatted numerical value parameters using localized Indian Rupee metrics format */}
              <h4 className="text-xl font-black text-gray-900 dark:text-white">
                ₹
                {card.value.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className={`rounded-xl p-2.5 ${card.color}`}>
              <card.icon size={18} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
