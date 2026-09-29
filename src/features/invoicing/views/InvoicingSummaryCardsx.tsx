// src/features/invoicing/views/InvoicingSummaryCards.tsx
import React from "react";
import type { InvoicingSummary } from "../types";
import { Card } from "flowbite-react";
import { DollarSign, Landmark, AlertTriangle, FileJson } from "lucide-react";

export const InvoicingSummaryCardsx: React.FC<{
  summary?: InvoicingSummary;
}> = ({ summary }) => {
  const cards = [
    {
      title: "Gross Receivables",
      value: summary?.gross_receivables || 0,
      color: "text-green-600 bg-green-50",
      icon: DollarSign,
    },
    {
      title: "Collected Funds",
      value: summary?.collected_funds || 0,
      color: "text-blue-600 bg-blue-50",
      icon: Landmark,
    },
    {
      title: "Overdue Arrears",
      value: summary?.overdue_arrears || 0,
      color: "text-red-600 bg-red-50",
      icon: AlertTriangle,
    },
    {
      title: "Draft Allocations",
      value: summary?.draft_allocations || 0,
      color: "text-gray-600 bg-gray-50",
      icon: FileJson,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => (
        <Card
          key={idx}
          className="border border-gray-100 shadow-sm dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                {card.title}
              </p>
              <h4 className="mt-1 text-xl font-black text-gray-900 dark:text-white">
                ₹
                {card.value.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </h4>
            </div>
            <div className={`rounded-xl p-2.5 ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
