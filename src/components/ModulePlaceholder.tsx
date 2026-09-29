// src/components/ModulePlaceholder.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Badge } from "flowbite-react";
import { Cpu, Hammer } from "lucide-react";

export const ModulePlaceholder: React.FC = () => {
  const location = useLocation();
  // Capitalise the URL path segment cleanly to use as a dynamic module name title
  const moduleName =
    location.pathname.split("/").pop()?.replace("-", " ") || "Enterprise";

  return (
    <div className="p-6 font-sans">
      <Card className="mx-auto max-w-xl border border-gray-100 shadow-sm dark:border-gray-700">
        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 animate-pulse rounded-2xl p-4">
            <Cpu size={32} />
          </div>
          <Badge
            color="purple"
            className="font-mono text-[10px] tracking-wider uppercase"
          >
            Module Sandbox Active
          </Badge>
          <h3 className="mt-2 text-xl font-black tracking-tight text-gray-900 capitalize dark:text-white">
            {moduleName} Grid Shell
          </h3>
          <p className="max-w-sm text-xs leading-relaxed text-gray-400">
            The router pathway{" "}
            <span className="rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-red-500 dark:bg-gray-800">
              {location.pathname}
            </span>{" "}
            has resolved flawlessly. Core multi-tenant scaffolding is active.
            Ready for functional business endpoint injections.
          </p>
          <div className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-gray-100 pt-4 text-[11px] font-bold text-gray-400 dark:border-gray-700/80 dark:text-gray-500">
            <Hammer size={12} /> Standard Micro-Architecture Framework Layer
          </div>
        </div>
      </Card>
    </div>
  );
};
