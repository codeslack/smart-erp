import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { apiClient } from "./axios";

export const axiosBaseQueryMock =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = "GET", data, params, headers }) => {
    // =================================================================
    // PROACTIVE DEVELOPMENT INTERCEPTORS (Intercepts BEFORE network triggers)
    // =================================================================

    // 1. Instantly fulfill login attempts locally without hitting Axios
    if (url.includes("/auth/login")) {
      console.warn(
        "[Sandbox BaseQuery]: Intercepted BEFORE Axios network layer. Simulating Session.",
      );
      return {
        /* 
      FIXED: Wrapped the session properties inside an explicit 'data' wrapper payload object. 
      This is required so RTK Query passes it cleanly to matchFulfilled listeners.
    */
        data: {
          token: "mock-jwt-token-from-laravel-herd",
          user: {
            id: 1,
            name: "Lead Administrator",
            email: "admin@smart-erp.test",
          },
        },
      };
    }

    // 2. Instantly fulfill user directory queries locally without hitting Axios
    if (url.includes("/users")) {
      console.warn(
        "[Sandbox BaseQuery]: Intercepted BEFORE Axios network layer. Simulating Employee Dataset.",
      );
      return {
        data: [
          {
            id: 101,
            name: "Alex Mercer",
            email: "alex.m@company.com",
            role: "Chief Financial Officer",
            status: "active",
          },
          {
            id: 102,
            name: "Sarah Connor",
            email: "sarah.c@company.com",
            role: "System Administrator",
            status: "active",
          },
          {
            id: 103,
            name: "David Lightman",
            email: "david.l@company.com",
            role: "Internal Auditor",
            status: "suspended",
          },
        ],
      };
    }

    // Add this proactive block inside your axiosBaseQuery to satisfy User Creation mock cycles
    if (url.includes("/users") && method === "POST") {
      console.warn(
        "[Sandbox BaseQuery]: Intercepted USER CREATION POST. Committing mock user payload.",
      );
      return {
        data: {
          id: Math.floor(Math.random() * 1000) + 200,
          name: data.name || "New Employee",
          email: data.email || "employee@company.com",
          role: data.role || "Staff Operator",
          status: "active",
        },
      };
    }

    // Add this block inside your axiosBaseQuery proactively to handle the accounting path
    if (url.includes("/accounting/chart-of-accounts")) {
      console.warn(
        "[Sandbox BaseQuery]: Intercepted BEFORE Axios network layer. Simulating General Ledger.",
      );
      return {
        data: [
          {
            id: 1,
            code: "1010",
            name: "Corporate Operating Bank Account",
            type: "asset",
            balance: 145250.0,
            updated_at: "2026-06-29",
          },
          {
            id: 2,
            code: "1200",
            name: "Accounts Receivable (AR)",
            type: "asset",
            balance: 48900.5,
            updated_at: "2026-06-29",
          },
          {
            id: 3,
            code: "2000",
            name: "Accounts Payable (AP)",
            type: "liability",
            balance: 12400.0,
            updated_at: "2026-06-29",
          },
          {
            id: 4,
            code: "3000",
            name: "Retained Earnings Equity",
            type: "equity",
            balance: 150000.0,
            updated_at: "2026-06-29",
          },
          {
            id: 5,
            code: "4000",
            name: "SaaS Platform Revenue Sales",
            type: "revenue",
            balance: 41250.5,
            updated_at: "2026-06-29",
          },
          {
            id: 6,
            code: "6100",
            name: "Cloud Infrastructure Hosting Fees",
            type: "expense",
            balance: 9500.0,
            updated_at: "2026-06-29",
          },
        ],
      };
    }

    // Add this block inside your axiosBaseQuery proactively to bypass invoice paths locally
    if (url.includes("/invoices")) {
      console.warn(
        "[Sandbox BaseQuery]: Simulating Paginated Server Responses.",
      );
      return {
        data: {
          current_page: params?.page || 1,
          last_page: 3,
          total: 12,
          data: [
            {
              id: 1,
              invoice_number: "INV-2026-001",
              client_name: params?.search
                ? `Filtered: ${params.search}`
                : "Acme Corp",
              amount: 12500.0,
              status: "paid",
              due_date: "2026-07-15",
            },
            {
              id: 2,
              invoice_number: "INV-2026-002",
              client_name: "Cyberdyne Systems",
              amount: 8900.0,
              status: "pending",
              due_date: "2026-07-22",
            },
            {
              id: 3,
              invoice_number: "INV-2026-003",
              client_name: "Stark Industries",
              amount: 45000.0,
              status: "overdue",
              due_date: "2026-06-10",
            },
          ],
        },
      };
    }

    // Add this block inside your axiosBaseQuery proactively to mock analytics paths locally
    if (url.includes("/dashboard/summary")) {
      console.warn(
        "[Sandbox BaseQuery]: Intercepted BEFORE Axios network layer. Simulating Analytics.",
      );
      return {
        data: {
          total_revenue: 41250.5,
          open_receivables: 53900.5,
          active_personnel: 2,
          ledger_solvency: 181751.0,
          recent_activity: [
            {
              id: 1,
              description:
                "Invoice INV-2026-001 marked as PAID by Acme Global Corp",
              timestamp: "10 mins ago",
              type: "invoice",
            },
            {
              id: 2,
              description:
                "General Journal Entry posted to Corporate Operating Bank Account",
              timestamp: "1 hour ago",
              type: "ledger",
            },
            {
              id: 3,
              description:
                "Employee Alex Mercer permission metrics updated to Administrator",
              timestamp: "2 hours ago",
              type: "user",
            },
          ],
        },
      };
    }

    // =================================================================
    // PRODUCTION NETWORK TUNNEL
    // =================================================================
    try {
      const result = await apiClient({ url, method, data, params, headers });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
