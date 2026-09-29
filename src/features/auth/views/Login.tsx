import React, { useState } from "react";
import type { FC } from "react";
import {
  useFetchUserTenantsMutation,
  useLoginWithTenantMutation,
  setAuthSession,
} from "@/features/auth"; // FIXED: Imported setAuthSession action
import { useAppDispatch } from "@/store/hooks"; // FIXED: Imported your typed dispatch hook
import {
  Button,
  Label,
  TextInput,
  Card,
  Alert,
  Spinner,
  Select,
} from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Lock,
  Mail,
  Building2,
  ChevronRight,
  LogIn,
} from "lucide-react";
import type { Tenant } from "../types";
import axios from "axios";
// Around your login inputs inside src/features/auth/views/Login.tsx:
import { getFieldError } from '@/utils/errorMapper'; // 1. Load helper
import { InputError } from '@/components/InputError'; // 2. Load atomic layout error banner

export const Login: React.FC = () => {
  const dispatch = useAppDispatch(); // FIXED: Instantiate core state dispatcher
  const [email, setEmail] = useState("admin@erp.com");
  const [password, setPassword] = useState("password123");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenantSlug, setSelectedTenantSlug] = useState("");
  const [loginStep, setLoginStep] = useState<1 | 2>(1);

  const [fetchTenants, { isLoading: isDiscovering, error: discoverError }] =
    useFetchUserTenantsMutation();
  const [loginWithTenant, { isLoading: isAuthenticating, error: authError }] =
    useLoginWithTenantMutation();
  const navigate = useNavigate();

  const handleDiscoverTenants = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchTenants({ email, password }).unwrap();
      if (response.data && response.data.length > 0) {
        setTenants(response.data);
        setSelectedTenantSlug(response.data[0].slug); // FIXED: Select first array entity fallback
        setLoginStep(2);
      }
    } catch (err) {
      console.error("Discovery cycle failure:", err);
    }
  };

  const handleFinalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Instantly extract 'https://smart-erp-api.test' regardless of whether /api is at the end
      const apiOrigin = new URL(import.meta.env.VITE_API_BASE_URL as string)
        .origin;

      // 2. Safely initiate the cookie handshake at the absolute root of your backend domain
      await axios.get(`${apiOrigin}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });

      const response = await loginWithTenant({
        email,
        password,
        tenant: selectedTenantSlug,
      }).unwrap();

      /* 
        FIXED: Dispatch your session variables directly upon resolving unwrap payload.
        This completely sidesteps circular import races!
      */
      dispatch(
        setAuthSession({
          token: response.token,
          user: response.user,
          tenantSlug: selectedTenantSlug,
        }),
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Final authorization session failed:", err);
    }
  };

  const errorState = discoverError || authError;
  const serverError = errorState as { data?: { message?: string } } | undefined;
  const errorMessage: string = String(
    serverError?.data?.message || "Invalid credentials or account mismatch.",
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-md border border-gray-200 font-sans shadow-xl dark:border-gray-700">
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full p-3">
            <ShieldAlert size={32} aria-hidden="true" />
          </div>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Smart ERP Portal
          </h2>
          <p className="text-xs font-medium text-gray-500">
            {loginStep === 1
              ? "Phase 1: Verification Check"
              : "Phase 2: Environment Selection"}
          </p>
        </div>

        {errorState ? (
          <Alert color="failure" className="text-sm font-medium">
            <span>{errorMessage}</span>
          </Alert>
        ) : null}

        {loginStep === 1 && (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleDiscoverTenants}
          >
            <div>
              <div className="mb-2 block">
                <Label>Corporate Email</Label>
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                icon={Mail as FC<React.ComponentProps<"svg">>}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color={getFieldError(authError, 'email') ? 'failure' : 'gray'}
              />
              <InputError message={getFieldError(authError, 'email')} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label>System Password</Label>
              </div>
              <TextInput
                id="password"
                type="password"
                icon={Lock as FC<React.ComponentProps<"svg">>}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              color="blue"
              disabled={isDiscovering}
              className="mt-2 w-full font-semibold"
            >
              {isDiscovering ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <>
                  <ChevronRight className="mr-2 h-4 w-4" /> Verify Account
                </>
              )}
            </Button>
          </form>
        )}

        {loginStep === 2 && (
          <form className="flex flex-col gap-4" onSubmit={handleFinalLogin}>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
              Identity Confirmed:{" "}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {email}
              </span>
            </div>

            <div>
              <div className="mb-2 block">
                <Label>Select Your Target Corporate Workspace</Label>
              </div>
              <Select
                id="tenant-select"
                icon={Building2 as FC<React.ComponentProps<"svg">>}
                required
                value={selectedTenantSlug}
                onChange={(e) => setSelectedTenantSlug(e.target.value)}
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name} ({t.domain})
                  </option>
                ))}
              </Select>
            </div>

            <div className="mt-2 flex gap-2">
              <Button
                color="gray"
                onClick={() => setLoginStep(1)}
                disabled={isAuthenticating}
                className="w-1/3 font-medium"
              >
                Back
              </Button>
              <Button
                type="submit"
                color="blue"
                disabled={isAuthenticating}
                className="w-2/3 font-semibold"
              >
                {isAuthenticating ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Access ERP
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
