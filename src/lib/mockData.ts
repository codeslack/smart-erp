// src/lib/mockData.ts

export const getMockData = (
  url: string,
  method = "GET",
  params?: any,
  data?: any,
) => {
  // 1. Auth Login Mock Data
  if (url.includes("/api/auth/login")) {
    return {
      token: "mock-jwt-token-from-laravel-herd",
      user: {
        id: data?.tenant === "xyz-company" ? 3 : 1,
        name: "Super Admin",
        email: data?.email || "admin@example.com",
      },
    };
  }

  // 2. Discover Tenants Mock Data
  if (url.includes("/api/tenants")) {
    return {
      data: [
        {
          id: 3,
          name: "XYZ Company",
          slug: "xyz-company",
          domain: "local.domain",
          is_active: true,
        },
        {
          id: 2,
          name: "ABC Company",
          slug: "abc-company",
          domain: "abc.local",
          is_active: true,
        },
        {
          id: 1,
          name: "Demo Company",
          slug: "demo-company",
          domain: "demo.local",
          is_active: true,
        },
      ],
    };
  }

  if (url.includes("/api/auth/me")) {
    console.warn(
      "[Sandbox BaseQuery]: Intercepted BEFORE Axios network layer. Simulating Analytics.",
    );
    return {
      data: {
        total_revenue: 41250.5,
        open_receivables: 53900.5,
        active_personnel: 3,
        ledger_solvency: 181751.0,
        recent_activity: [
          {
            id: 1,
            description: "Invoice INV-2026-001 marked as PAID by XYZ Company",
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

  // 3. User Directory Mock Data
  if (url.includes("/api/users")) {
    return {
      current_page: params?.page || 1,
      last_page: 1,
      total: 3,
      per_page: 15,
      data: [
        {
          id: 3,
          tenant_id: 3,
          name: "Supper Admin (XYZ)",
          email: "admin.xyz@example.com",
          is_active: true,
          created_at: "2026-06-16T09:34:37.000000Z",
        },
        {
          id: 2,
          tenant_id: 2,
          name: "Supper Admin (ABC)",
          email: "admin.abc@example.com",
          is_active: true,
          created_at: "2026-06-16T09:33:37.000000Z",
        },
        {
          id: 1,
          tenant_id: 1,
          name: "Super Admin",
          email: "admin@example.com",
          is_active: true,
          created_at: "2026-06-16T09:10:27.000000Z",
        },
      ],
    };
  }

  if (url.includes("/api/accounting/account-groups")) {
    return {
      meta: { current_page: 1, last_page: 1, total: 5 },
      data: [
        { id: 1, tenant_id: 1, name: "Assets", code: "AST" },
        { id: 3, tenant_id: 1, name: "Equity", code: "EQT" },
        { id: 5, tenant_id: 1, name: "Expense", code: "EXP" },
        { id: 4, tenant_id: 1, name: "Income", code: "INC" },
        { id: 2, tenant_id: 1, name: "Liabilities", code: "LIA" },
      ],
    };
  }

  // 4. Accounting Chart of Accounts Mock Data
  if (url.includes("/api/accounting/chart-of-accounts")) {
    return {
      meta: { current_page: params?.page || 1, last_page: 1, total: 10 },
      data: [
        {
          id: 1,
          tenant_id: 1,
          account_group_id: 1,
          parent_id: null,
          account_code: "1000",
          account_name: "Cash",
          account_type: "asset",
          opening_balance: "0.0000",
          current_balance: "95000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:43:35.000000Z",
          group: {
            id: 1,
            tenant_id: 1,
            name: "Assets",
            code: "AST",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 2,
          tenant_id: 1,
          account_group_id: 1,
          parent_id: null,
          account_code: "1010",
          account_name: "Bank",
          account_type: "asset",
          opening_balance: "0.0000",
          current_balance: "0.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-24T19:43:26.000000Z",
          group: {
            id: 1,
            tenant_id: 1,
            name: "Assets",
            code: "AST",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 3,
          tenant_id: 1,
          account_group_id: 1,
          parent_id: null,
          account_code: "1100",
          account_name: "Accounts Receivable",
          account_type: "asset",
          opening_balance: "0.0000",
          current_balance: "15000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:43:35.000000Z",
          group: {
            id: 1,
            tenant_id: 1,
            name: "Assets",
            code: "AST",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 4,
          tenant_id: 1,
          account_group_id: 1,
          parent_id: null,
          account_code: "1200",
          account_name: "Inventory",
          account_type: "asset",
          opening_balance: "0.0000",
          current_balance: "25000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:42:05.000000Z",
          group: {
            id: 1,
            tenant_id: 1,
            name: "Assets",
            code: "AST",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 5,
          tenant_id: 1,
          account_group_id: 2,
          parent_id: null,
          account_code: "2000",
          account_name: "Accounts Payable",
          account_type: "liability",
          opening_balance: "0.0000",
          current_balance: "30000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:39:35.000000Z",
          group: {
            id: 2,
            tenant_id: 1,
            name: "Liabilities",
            code: "LIA",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 6,
          tenant_id: 1,
          account_group_id: 3,
          parent_id: null,
          account_code: "3000",
          account_name: "Owner Equity",
          account_type: "equity",
          opening_balance: "0.0000",
          current_balance: "100000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:37:08.000000Z",
          group: {
            id: 3,
            tenant_id: 1,
            name: "Equity",
            code: "EQT",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 7,
          tenant_id: 1,
          account_group_id: 4,
          parent_id: null,
          account_code: "4000",
          account_name: "Sales Revenue",
          account_type: "income",
          opening_balance: "0.0000",
          current_balance: "30000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:42:05.000000Z",
          group: {
            id: 4,
            tenant_id: 1,
            name: "Income",
            code: "INC",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 8,
          tenant_id: 1,
          account_group_id: 4,
          parent_id: null,
          account_code: "4100",
          account_name: "Sales Return",
          account_type: "income",
          opening_balance: "0.0000",
          current_balance: "0.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-24T19:43:26.000000Z",
          group: {
            id: 4,
            tenant_id: 1,
            name: "Income",
            code: "INC",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 9,
          tenant_id: 1,
          account_group_id: 5,
          parent_id: null,
          account_code: "5000",
          account_name: "Cost of Goods Sold",
          account_type: "expense",
          opening_balance: "0.0000",
          current_balance: "25000.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-27T19:42:05.000000Z",
          group: {
            id: 5,
            tenant_id: 1,
            name: "Expense",
            code: "EXP",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
        {
          id: 10,
          tenant_id: 1,
          account_group_id: 5,
          parent_id: null,
          account_code: "5100",
          account_name: "Purchase Return",
          account_type: "expense",
          opening_balance: "0.0000",
          current_balance: "0.0000",
          is_system: true,
          is_active: true,
          created_at: "2026-06-24T19:43:26.000000Z",
          updated_at: "2026-06-24T19:43:26.000000Z",
          group: {
            id: 5,
            tenant_id: 1,
            name: "Expense",
            code: "EXP",
            created_at: "2026-06-24T19:43:26.000000Z",
            updated_at: "2026-06-24T19:43:26.000000Z",
          },
          parent: null,
        },
      ],
    };
  }

  // 5. Accounting Journal Entries Mock Data
  if (url.includes("/api/accounting/journal-entries")) {
    return {
      meta: { current_page: 1, last_page: 1, total: 5 },
      data: [
        {
          id: 1,
          voucher_no: "JV-000001",
          voucher_type: "journal",
          entry_date: "2026-06-01T00:00:00.000000Z",
          description: "Owner invested capital",
          status: "posted",
          reference_type: null,
          reference_id: null,
          lines: [
            {
              id: 1,
              chart_of_account_id: 1,
              account_name: "Cash",
              debit: "100000.0000",
              credit: "0.0000",
              description: null,
            },
            {
              id: 2,
              chart_of_account_id: 6,
              account_name: "Owner Equity",
              debit: "0.0000",
              credit: "100000.0000",
              description: null,
            },
          ],
        },
        {
          id: 4,
          voucher_no: "JV-000004",
          voucher_type: "sale",
          entry_date: "2026-06-10T00:00:00.000000Z",
          description: "Sale SAL-000001",
          status: "posted",
          reference_type: "App\\Modules\\Sales\\Models\\Sale",
          reference_id: 1,
          lines: [
            {
              id: 7,
              chart_of_account_id: 3,
              account_name: "Accounts Receivable",
              debit: "30000.0000",
              credit: "0.0000",
              description: null,
            },
            {
              id: 8,
              chart_of_account_id: 7,
              account_name: "Sales Revenue",
              debit: "0.0000",
              credit: "30000.0000",
              description: null,
            },
          ],
        },
      ],
    };
  }

  if (url.includes("/api/accounting/profit-loss")) {
    console.warn(
      "[Sandbox BaseQuery]: Serving precise paginated Profit & Loss payload arrays.",
    );
    return {
      success: true,
      message: "Profit & Loss fetched successfully",
      data: {
        income_accounts: [
          {
            account_code: "4000",
            account_name: "Sales Revenue",
            amount: 30000,
          },
          { account_code: "4100", account_name: "Sales Return", amount: 0 },
        ],
        expense_accounts: [
          {
            account_code: "5000",
            account_name: "Cost of Goods Sold",
            amount: 25000,
          },
          { account_code: "5100", account_name: "Purchase Return", amount: 0 },
        ],
        total_income: 30000,
        total_expense: 25000,
        net_profit: 5000,
      },
    };
  }

  if (url.includes("/api/accounting/trial-balance")) {
    console.warn(
      "[Sandbox BaseQuery]: Serving verified double-entry Trial Balance.",
    );
    return {
      success: true,
      message: "Trial Balance fetched successfully",
      data: {
        accounts: [
          {
            account_code: "1000",
            account_name: "Cash",
            account_type: "asset",
            debit: 95000,
            credit: 0,
          },
          {
            account_code: "1010",
            account_name: "Bank",
            account_type: "asset",
            debit: 0,
            credit: 0,
          },
          {
            account_code: "1100",
            account_name: "Accounts Receivable",
            account_type: "asset",
            debit: 15000,
            credit: 0,
          },
          {
            account_code: "1200",
            account_name: "Inventory",
            account_type: "asset",
            debit: 25000,
            credit: 0,
          },
          {
            account_code: "2000",
            account_name: "Accounts Payable",
            account_type: "liability",
            debit: 0,
            credit: 30000,
          },
          {
            account_code: "3000",
            account_name: "Owner Equity",
            account_type: "equity",
            debit: 0,
            credit: 100000,
          },
          {
            account_code: "4000",
            account_name: "Sales Revenue",
            account_type: "income",
            debit: 0,
            credit: 30000,
          },
          {
            account_code: "4100",
            account_name: "Sales Return",
            account_type: "income",
            debit: 0,
            credit: 0,
          },
          {
            account_code: "5000",
            account_name: "Cost of Goods Sold",
            account_type: "expense",
            debit: 25000,
            credit: 0,
          },
          {
            account_code: "5100",
            account_name: "Purchase Return",
            account_type: "expense",
            debit: 0,
            credit: 0,
          },
        ],
        total_debit: 160000,
        total_credit: 160000,
        is_balanced: true,
      },
    };
  }

  if (url.includes("/api/invoices")) {
    console.warn(
      "[Sandbox BaseQuery]: Simulating Accounts Receivable datasets.",
    );
    return {
      summary: {
        gross_receivables: 185000.0,
        collected_funds: 125000.0,
        overdue_arrears: 45000.0,
        draft_allocations: 15000.0,
      },
      invoices: {
        current_page: params?.page || 1,
        last_page: 1,
        total: 3,
        data: [
          {
            id: 1,
            invoice_no: "INV-000001",
            client_name: "Acme Corporate Ltd",
            issue_date: "2026-06-01",
            due_date: "2026-07-01",
            amount: 45000,
            status: "overdue",
          },
          {
            id: 2,
            invoice_no: "INV-000002",
            client_name: "Bharat Telecom Enterprise",
            issue_date: "2026-06-15",
            due_date: "2026-07-15",
            amount: 125000,
            status: "paid",
          },
          {
            id: 3,
            invoice_no: "INV-000003",
            client_name: "Delta Infra Structure",
            issue_date: "2026-06-20",
            due_date: "2026-07-20",
            amount: 15000,
            status: "pending",
          },
        ],
      },
    };
  }

  if (url.includes("/api/categories")) {
    if (method === "POST" || method === "PUT") {
      return {
        id: 301,
        name: data?.name || "Test Category",
        description: data?.description,
        is_active: true,
      };
    }
    return {
      meta: { current_page: 1, last_page: 1, total: 2 },
      data: [
        {
          id: 1,
          tenant_id: 1,
          name: "Finished Goods",
          code: "FNG",
          description: "Ready to sell product inventory lines",
          is_active: true,
          created_at: "2026-06-24",
          updated_at: "2026-06-24",
        },
        {
          id: 2,
          tenant_id: 1,
          name: "Packaging Materials",
          code: "PKG",
          description: "Boxes, wraps and structural shipment masters",
          is_active: true,
          created_at: "2026-06-24",
          updated_at: "2026-06-24",
        },
      ],
    };
  }

  // 6. Dashboard Summary Mock Data
  if (url.includes("/api/dashboard/summary")) {
    return {
      total_revenue: 41250.5,
      open_receivables: 53900.5,
      active_personnel: 3,
      ledger_solvency: 181751.0,
      recent_activity: [
        {
          id: 1,
          description: "Invoice INV-2026-001 marked as PAID by XYZ Company",
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
      ],
    };
  }

  if (url.includes("/api/warehouses")) {
    if (method === "POST" || method === "PUT") {
      return {
        id: 401,
        tenant_id: 1,
        code: data.code || "WH-TST",
        name: data.name || "Test WH",
        phone: data.phone,
        email: data.email,
        address: data.address,
        is_active: true,
      };
    }
    return {
      meta: { current_page: 1, last_page: 1, total: 2 },
      data: [
        {
          id: 1,
          tenant_id: 1,
          code: "WH-MUM",
          name: "Mumbai Main Logistics Hub",
          phone: "022-987654",
          email: "mumbai.hub@smart-erp.test",
          address: "Sector 12, Kalamboli Warehousing Complex, Navi Mumbai",
          is_active: true,
          created_at: "2026-06-24",
          updated_at: "2026-06-24",
        },
        {
          id: 2,
          tenant_id: 1,
          code: "WH-DEL",
          name: "Delhi NCR Distribution Center",
          phone: "011-234567",
          email: "delhi.center@smart-erp.test",
          address: "Khasra No. 34, Okhla Industrial Area Phase III, New Delhi",
          is_active: true,
          created_at: "2026-06-24",
          updated_at: "2026-06-24",
        },
      ],
    };
  }

  if (url.includes("/api/customers")) {
    if (method === "POST" || method === "PUT")
      return {
        id: 1,
        name: data.name,
        code: data.code,
        tax_number: data.tax_number,
        current_balance: "0.00",
        is_active: true,
      };
    return {
      meta: { current_page: 1, last_page: 1, total: 1 },
      data: [
        {
          id: 1,
          tenant_id: 1,
          name: "Acme Corporate Ltd",
          code: "C001",
          contact_person: "Rajesh Kumar",
          email: "rajesh@acme.in",
          phone: "9876543210",
          address: "Mumbai",
          tax_number: "27AAAAA1111A1Z1",
          current_balance: "12500.00",
          is_active: true,
          created_at: "2026-06-24",
        },
      ],
    };
  }

  if (url.includes("/api/suppliers")) {
    if (method === "POST" || method === "PUT")
      return {
        id: 1,
        name: data.name,
        code: data.code,
        tax_number: data.tax_number,
        current_balance: "0.00",
        is_active: true,
      };
    return {
      meta: { current_page: 1, last_page: 1, total: 1 },
      data: [
        {
          id: 1,
          tenant_id: 1,
          name: "Supreme Raw Supplier Corp",
          code: "S001",
          contact_person: "Anil Sharma",
          email: "sales@supreme.co.in",
          phone: "9123456789",
          address: "Delhi",
          tax_number: "27BBBBB2222B1Z1",
          current_balance: "45000.00",
          is_active: true,
          created_at: "2026-06-24",
        },
      ],
    };
  }

  return null;
};
