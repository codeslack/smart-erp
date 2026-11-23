# Smart ERP Frontend

A modern, modular, production-ready Enterprise Resource Planning (ERP) frontend built with **React 19**, **TypeScript**, **Redux Toolkit**, **Flowbite React**, and **Tailwind CSS**, integrated directly with the Laravel 13 [Smart ERP API](https://github.com/codeslack/smart-erp-api).

---

## 1. Project Overview

Smart ERP is designed as a modular client application for managing core business workflows in a multi-tenant corporate environment. The user interface adheres to clean enterprise UX standards, featuring dark/light theme support, responsive layouts, role-based access control (RBAC), accessible Flowbite components, and strict contract alignment with the backend API.

### Core Capabilities
- **Authentication & RBAC**: Secure Sanctum token-based authentication, auto-session hydration, and permission/role-aware route protection.
- **Executive Dashboard**: KPI metric stat cards, financial & sales trend charts (Recharts), and quick-action navigation.
- **Master Data**: Complete management for Customers, Suppliers, Products, Product Categories, Brands, Units, Warehouses, and Payment Terms.
- **Sales & Procurement**: Endpoints for Sales Quotations, Sales Orders, Sales Invoices, Purchase Orders, Goods Receipt Notes (GRN), and Purchase Bills.
- **Financial Accounting**: Interactive Chart of Accounts, Account Groups, Journal Entry posting/cancellation, and automated Financial Reports (Trial Balance, General Ledger, Balance Sheet, Profit & Loss, Cash Book, Day Book, Aging).
- **Payments & Advances**: Unified payment confirmation, cancellation, reversal, and customer/supplier advance allocations.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Runtime & Core** | React | ^19.2.7 | Functional components, hooks, modern React architecture |
| **Language** | TypeScript | ~6.0.2 | Strict type safety, exact DTO contracts, zero `any` policy |
| **Build Tool** | Vite | ^8.1.0 | Fast HMR dev server and optimized production bundling |
| **Routing** | React Router | ^7.18.0 | Declarative client routing, nested layouts, protected routes |
| **State Management** | Redux Toolkit | ^2.12.0 | Predictable global client state (`auth`, `ui`, `notifications`) |
| **UI Components** | Flowbite React | ^0.12.17 | Accessible enterprise UI components (Tables, Modals, Forms, Drawers, Badges) |
| **Styling** | Tailwind CSS | ^4.0.0 | Utility-first styling, responsive grids, dark/light theme tokens |
| **HTTP Client** | Axios | ^1.18.1 | Centralized instance, Bearer interceptors, normalized 401/422 error handling |
| **Form Handling** | React Hook Form + Zod | ^7.84.0 / ^4.6.7 | Type-safe form validation matching backend validation rules |
| **Visualizations** | Recharts | ^3.11.0 | Interactive KPI area and bar charts |
| **Date Utilities** | date-fns | ^4.4.0 | Date parsing, formatting, and input conversion |
| **Icons** | Lucide React | ^1.22.0 | Clean, consistent SVG iconography |

---

## 3. Project Directory Structure

```text
src/
├── app/                        # Global Redux store and typed hooks
│   ├── store.ts                # configureStore setup
│   └── hooks.ts                # useAppDispatch & useAppSelector
├── assets/                     # Static images, logos, and vector assets
├── components/
│   ├── ui/                     # Flowbite React wrappers (DataTable, StatCard, EmptyState, etc.)
│   ├── layout/                 # Layout components (AppLayout, Sidebar, TopNavbar)
│   └── common/                 # Reusable utility UI elements (Badges, Buttons)
├── features/                   # Domain-driven feature modules
│   ├── auth/                   # Login, session hydration, authSlice, authService
│   ├── dashboard/              # Executive KPI metrics, charts, quick actions
│   ├── customers/              # Customer CRUD, filters, opening bills, types, API service
│   ├── suppliers/              # Supplier CRUD, opening bills, types, API service
│   ├── products/               # Products, variants, categories, brands, units
│   ├── inventory/              # Stock quarantine, opening stock
│   ├── sales/                  # Quotations, Sales Orders, Sales Invoices, Returns
│   ├── purchases/              # Purchase Orders, GRNs, Bills, Purchase Returns
│   ├── invoices/               # Billing and document views
│   ├── payments/               # Payment vouchers, reversals, advance allocations
│   ├── employees/              # User management, roles, and permission assignments
│   ├── reports/                # Balance Sheet, Trial Balance, General Ledger, Aging
│   └── settings/               # System & company settings by group
├── hooks/                      # Global custom hooks (useAuth, useTheme, useDebounce)
├── lib/
│   └── axios.ts                # Centralized Axios client with interceptors
├── services/                   # Shared cross-cutting API services
├── types/
│   ├── api.ts                  # ApiResponse, ApiPaginatedResponse, PaginationMeta, ApiErrorResponse
│   ├── common.ts               # ThemeMode, TableColumn, StatusVariant
│   └── ...                     # Feature-specific DTO interfaces
├── utils/
│   ├── errors.ts               # Axios error message & Laravel 422 error bag extractors
│   ├── formatters.ts           # Currency, percentage, and number formatting
│   ├── date.ts                 # date-fns formatting helpers
│   └── storage.ts              # LocalStorage wrapper (token, user, theme)
└── routes/
    ├── AppRoutes.tsx           # Route definitions and layout mapping
    └── ProtectedRoute.tsx      # Auth guard and role-based access controller
```

---

## 4. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# API Base URL (points to Laravel backend)
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME="Smart ERP"
```

A template is maintained in `.env.example`.

---

## 5. Getting Started & Run Instructions

### Prerequisites
- Node.js 20+ (with npm 10+)
- Backend running at `http://localhost:8000/api` (or configured via `VITE_API_BASE_URL`)

### 1. Backend Setup (Laravel 13)
```bash
cd /path/to/smart-erp-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8000
```
*Default admin credentials created by seeders:*
- **Email**: `admin@example.com`
- **Password**: `password`

### 2. Frontend Setup
```bash
cd smart-erp
npm install
cp .env.example .env.local
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 6. Redux Architecture Guidelines

Redux Toolkit is reserved exclusively for **client-side global state**:

1. **`authSlice`**:
   - Manages `user`, `token`, `isAuthenticated`, `roles`, `permissions`, and loading status.
   - Clears credentials and active sessions on logout or 401 events.
2. **`uiSlice`**:
   - Manages `sidebarOpen`, `themeMode` ('light' | 'dark'), and global confirmation modal state (`confirmDialog`).
3. **`notificationSlice`**:
   - Manages a FIFO queue of active toast alerts (`addNotification`, `removeNotification`).
4. **Server Data Policy**:
   - Server data (lists, paginated records, details) remains local to feature hooks/components or dedicated service functions.
   - Never duplicate server state in Redux unless multiple distant modules need reactive synchrony.

---

## 7. Flowbite React & UI Component Design

- **Primary UI Library**: Flowbite React components (`Button`, `Card`, `Modal`, `Table`, `Badge`, `TextInput`, `Select`, `Dropdown`, `Breadcrumb`).
- **Standardized Wrappers**:
  - `DataTable<T>`: Reusable table with custom cell rendering, pagination, skeleton loading, and empty states.
  - `PageHeader`: Consistent breadcrumb, page title, and action buttons.
  - `StatCard`: Visual KPI display with status badges and trends.
  - `ConfirmDialog`: Global modal preventing accidental destructive actions.
  - `EmptyState` / `ErrorState`: Friendly UX messaging with retry triggers.
- **Theme Support**: Centralized dark/light mode toggle with Tailwind's `class` strategy (`.dark`).

---

## 8. Discovered API Contract Summary

Directly derived from the Laravel backend controllers, resources, and routes:

| Module | Method | Endpoint | Request Payload / Params | Response Data |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | `{ email, password }` | `{ user: UserResource, token, token_type }` |
| | `GET` | `/api/auth/me` | *Bearer Token Header* | `UserResource` |
| | `POST` | `/api/auth/logout` | *Bearer Token Header* | `null` |
| **Customers** | `GET` | `/api/customers` | `?page=1&per_page=15` | `CustomerResource[]` (Paginated) |
| | `POST` | `/api/customers` | `{ name, code?, contact_person?, phone?, email?, address?, tax_number?, credit_limit?, credit_days?, is_active? }` | `CustomerResource` (`201 Created`) |
| | `GET` | `/api/customers/{uuid}` | Path: `uuid` | `CustomerResource` |
| | `PUT` | `/api/customers/{uuid}` | Partial customer payload | `CustomerResource` |
| | `DELETE`| `/api/customers/{uuid}` | Path: `uuid` | `null` |
| **Suppliers** | `GET` | `/api/suppliers` | `?page=1&per_page=15` | `SupplierResource[]` (Paginated) |
| | `POST` | `/api/suppliers` | `{ name, code?, phone?, email?, address?, tax_number?, is_active? }` | `SupplierResource` (`201 Created`) |
| **Products** | `GET` | `/api/products` | `?page=1&per_page=15` | `ProductResource[]` (Paginated) |
| | `POST` | `/api/products` | `{ name, sku?, category_uuid, brand_uuid?, unit_uuid, cost_price, selling_price, ... }` | `ProductResource` |
| **Accounting** | `GET` | `/api/chart-of-accounts` | Query filters | `ChartOfAccountResource[]` |
| | `POST` | `/api/journal-entries` | `{ date, reference_no, lines: [...] }` | `JournalEntryResource` |
| | `POST` | `/api/journal-entries/{uuid}/post` | Empty | `JournalEntryResource` |
| | `GET` | `/api/balance-sheet` | `?as_of_date=YYYY-MM-DD` | Financial report object |
| | `GET` | `/api/profit-loss` | `?from_date=...&to_date=...`| Financial report object |
| **Payments** | `GET` | `/api/payments` | `?page=1&per_page=15` | `PaymentResource[]` (Paginated) |
| | `POST` | `/api/payments/{uuid}/confirm` | Empty | `PaymentResource` |
| | `POST` | `/api/payments/{uuid}/reverse` | `{ reason: string }` | `PaymentResource` |

---

## 9. Assumptions & Backend Nuances

1. **Multi-Tenancy**: The backend automatically binds tenant context using the authenticated user's `tenant_id` on the server (`TenantMiddleware`). The frontend **must never** manually pass `tenant_id`.
2. **UUID Identification**: Route model binding and client references use public `uuid` fields rather than internal auto-increment IDs.
3. **Inactive/Blocked Modules**:
   - `StockAdjustment` and `StockTransfer` are not active in `config/modules.php`.
   - `DeliveryNotes` is legacy blocked code.
   - `Audit Logs` is currently pending design in the backend.
   Frontend avoids rendering routes or navigation for these inactive modules.

---

## 10. Available Scripts

- `npm run dev`: Start Vite development server at `http://localhost:5173`
- `npm run build`: Type-check with `tsc -b` and produce production build in `dist/`
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint inspection
- `npm run format`: Format code using Prettier with Tailwind plugin
