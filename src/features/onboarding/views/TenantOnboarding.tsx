import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, Button, TextInput, Label, Select, Alert } from 'flowbite-react';
import {
  Building2,
  Globe,
  Briefcase,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setTenant, setCredentials } from '@/features/auth/authSlice';
import { tenantService } from '@/services/tenantService';
import { authService } from '@/features/auth/authService';
import { addNotification } from '@/features/notifications/notificationSlice';
import { getErrorMessage, getValidationErrors } from '@/utils/errors';
import type { BusinessType } from '@/types/tenant';

const tenantOnboardingSchema = z
  .object({
    name: z.string().min(1, 'Company legal name is required').max(255),
    slug: z
      .string()
      .min(1, 'Slug identifier is required')
      .max(255)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    domain: z.string().max(255).optional(),
    business_type: z.enum([
      'GENERAL',
      'MEDICINE',
      'MOBILE',
      'COMPUTER',
      'RETAIL',
      'SPARE_PARTS',
      'MANUFACTURING',
      'DISTRIBUTION',
      'SERVICE',
    ]),
    timezone: z.string().optional(),
    fiscal_year_start_month: z.number().min(1).max(12),
    fiscal_year_start_day: z.number().min(1).max(31),
    admin_name: z.string().min(1, 'Administrator full name is required').max(255),
    admin_email: z.string().min(1, 'Admin email is required').email('Enter a valid email address').max(255),
    admin_password: z.string().min(8, 'Password must be at least 8 characters long'),
    admin_password_confirmation: z.string().min(8, 'Password confirmation is required'),
  })
  .refine((data) => data.admin_password === data.admin_password_confirmation, {
    message: 'Passwords do not match',
    path: ['admin_password_confirmation'],
  });

type TenantOnboardingFormValues = z.infer<typeof tenantOnboardingSchema>;

const BUSINESS_TYPE_OPTIONS: { label: string; value: BusinessType }[] = [
  { label: 'General Enterprise / Multi-industry', value: 'GENERAL' },
  { label: 'Pharmaceutical & Healthcare', value: 'MEDICINE' },
  { label: 'Electronics & Mobile Technology', value: 'MOBILE' },
  { label: 'Information Technology & Computing', value: 'COMPUTER' },
  { label: 'Retail & Consumer Goods', value: 'RETAIL' },
  { label: 'Automotive & Industrial Spare Parts', value: 'SPARE_PARTS' },
  { label: 'Manufacturing & Production', value: 'MANUFACTURING' },
  { label: 'Wholesale & Distribution Logistics', value: 'DISTRIBUTION' },
  { label: 'Professional Services & Consulting', value: 'SERVICE' },
];

export const TenantOnboarding: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hasTenant } = useAppSelector((state) => state.auth);

  const [formError, setFormError] = useState<string | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If a tenant already exists, redirect away to dashboard
  useEffect(() => {
    if (hasTenant) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasTenant, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TenantOnboardingFormValues>({
    resolver: zodResolver(tenantOnboardingSchema),
    defaultValues: {
      name: '',
      slug: '',
      domain: '',
      business_type: 'GENERAL',
      timezone: 'UTC',
      fiscal_year_start_month: 4,
      fiscal_year_start_day: 1,
      admin_name: '',
      admin_email: '',
      admin_password: '',
      admin_password_confirmation: '',
    },
  });

  const companyName = watch('name');

  // Auto-generate slug when name changes if user hasn't explicitly customized slug
  const handleGenerateSlug = () => {
    if (companyName) {
      const generated = companyName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', generated, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: TenantOnboardingFormValues) => {
    try {
      setFormError(null);
      setServerErrors({});
      setIsSubmitting(true);

      const payload = {
        name: values.name,
        slug: values.slug,
        domain: values.domain ? values.domain : undefined,
        business_type: values.business_type,
        timezone: values.timezone || 'UTC',
        fiscal_year_start_month: values.fiscal_year_start_month,
        fiscal_year_start_day: values.fiscal_year_start_day,
        admin_name: values.admin_name,
        admin_email: values.admin_email,
        admin_password: values.admin_password,
        admin_password_confirmation: values.admin_password_confirmation,
      };

      const newTenant = await tenantService.createTenant(payload);

      dispatch(setTenant(newTenant));

      dispatch(
        addNotification({
          type: 'success',
          title: 'Company Created',
          message: `${newTenant.name} has been successfully provisioned.`,
        })
      );

      // Authenticate with the newly created admin account
      try {
        const authData = await authService.login({
          email: values.admin_email,
          password: values.admin_password,
        });

        dispatch(
          setCredentials({
            user: authData.user,
            token: authData.token,
            tenant: newTenant,
          })
        );
      } catch {
        navigate('/login', { replace: true });
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Failed to create company workspace.');
      const valErrors = getValidationErrors(err);

      if (valErrors) {
        setServerErrors(valErrors);
        setFormError('Please resolve the validation errors indicated below.');
      } else {
        setFormError(message);
      }

      dispatch(
        addNotification({
          type: 'error',
          title: 'Registration Error',
          message,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header Banner */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white font-bold text-3xl shadow-xl shadow-primary-500/20">
            <Building2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Register Your <span className="text-primary-600">Company</span>
          </h1>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
            Provision your enterprise organization, initial chart of accounts, and root administrator.
          </p>
        </div>

        {/* Form Card */}
        <Card className="border border-gray-200 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {formError && (
            <Alert color="failure" icon={AlertCircle} className="mb-6">
              <span className="font-semibold">{formError}</span>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* 1. Company Organization Information */}
            <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
              <h2 className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                <Building2 className="mr-2 h-5 w-5 text-primary-600" />
                1. Organization Details
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                General corporate identity and operational category.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Legal Name */}
                <div className="sm:col-span-2">
                  <div className="mb-1 block">
                    <Label htmlFor="name">Legal Company Name *</Label>
                  </div>
                  <TextInput
                    id="name"
                    placeholder="e.g. Acme Corporation Global"
                    color={errors.name || serverErrors.name ? 'failure' : 'gray'}
                    {...register('name')}
                  />
                  {(errors.name || serverErrors.name) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.name?.message || serverErrors.name?.[0]}
                    </p>
                  )}
                </div>

                {/* Slug Identifier */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <Label htmlFor="slug">Unique Slug Identifier *</Label>
                    <button
                      type="button"
                      onClick={handleGenerateSlug}
                      className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Auto-generate
                    </button>
                  </div>
                  <TextInput
                    id="slug"
                    placeholder="acme-corporation"
                    color={errors.slug || serverErrors.slug ? 'failure' : 'gray'}
                    {...register('slug')}
                  />
                  {(errors.slug || serverErrors.slug) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.slug?.message || serverErrors.slug?.[0]}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="business_type">Industry Classification *</Label>
                  </div>
                  <Select
                    id="business_type"
                    icon={Briefcase}
                    color={errors.business_type || serverErrors.business_type ? 'failure' : 'gray'}
                    {...register('business_type')}
                  >
                    {BUSINESS_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  {(errors.business_type || serverErrors.business_type) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.business_type?.message || serverErrors.business_type?.[0]}
                    </p>
                  )}
                </div>

                {/* Custom Domain (Optional) */}
                <div className="sm:col-span-2">
                  <div className="mb-1 block">
                    <Label htmlFor="domain">Dashboard Hostname / Domain (Optional)</Label>
                  </div>
                  <TextInput
                    id="domain"
                    icon={Globe}
                    placeholder="e.g. acme.smart-erp.test"
                    color={errors.domain || serverErrors.domain ? 'failure' : 'gray'}
                    {...register('domain')}
                  />
                  {(errors.domain || serverErrors.domain) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.domain?.message || serverErrors.domain?.[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Fiscal & Timezone Settings */}
            <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
              <h2 className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                <Calendar className="mr-2 h-5 w-5 text-primary-600" />
                2. Fiscal Calendar & Locale
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Used to seed the initial Financial Year and period controls.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Timezone */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="timezone">Timezone</Label>
                  </div>
                  <TextInput
                    id="timezone"
                    icon={Clock}
                    placeholder="e.g. UTC, America/New_York"
                    color={errors.timezone || serverErrors.timezone ? 'failure' : 'gray'}
                    {...register('timezone')}
                  />
                  {(errors.timezone || serverErrors.timezone) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.timezone?.message || serverErrors.timezone?.[0]}
                    </p>
                  )}
                </div>

                {/* Fiscal Year Start Month */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="fiscal_year_start_month">Fiscal Start Month</Label>
                  </div>
                  <Select
                    id="fiscal_year_start_month"
                    color={errors.fiscal_year_start_month || serverErrors.fiscal_year_start_month ? 'failure' : 'gray'}
                    {...register('fiscal_year_start_month', { valueAsNumber: true })}
                  >
                    <option value={1}>January (01)</option>
                    <option value={2}>February (02)</option>
                    <option value={3}>March (03)</option>
                    <option value={4}>April (04 - Default)</option>
                    <option value={5}>May (05)</option>
                    <option value={6}>June (06)</option>
                    <option value={7}>July (07)</option>
                    <option value={8}>August (08)</option>
                    <option value={9}>September (09)</option>
                    <option value={10}>October (10)</option>
                    <option value={11}>November (11)</option>
                    <option value={12}>December (12)</option>
                  </Select>
                </div>

                {/* Fiscal Year Start Day */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="fiscal_year_start_day">Fiscal Start Day</Label>
                  </div>
                  <TextInput
                    id="fiscal_year_start_day"
                    type="number"
                    min={1}
                    max={31}
                    placeholder="1"
                    color={errors.fiscal_year_start_day || serverErrors.fiscal_year_start_day ? 'failure' : 'gray'}
                    {...register('fiscal_year_start_day', { valueAsNumber: true })}
                  />
                </div>
              </div>
            </div>

            {/* 3. Root Administrator Account */}
            <div>
              <h2 className="flex items-center text-lg font-bold text-gray-900 dark:text-white">
                <User className="mr-2 h-5 w-5 text-primary-600" />
                3. Root Administrator Account
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Initial super-admin credentials with full permissions.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Admin Full Name */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="admin_name">Administrator Name *</Label>
                  </div>
                  <TextInput
                    id="admin_name"
                    icon={User}
                    placeholder="e.g. John Doe"
                    color={errors.admin_name || serverErrors.admin_name ? 'failure' : 'gray'}
                    {...register('admin_name')}
                  />
                  {(errors.admin_name || serverErrors.admin_name) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.admin_name?.message || serverErrors.admin_name?.[0]}
                    </p>
                  )}
                </div>

                {/* Admin Email */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="admin_email">Administrator Email *</Label>
                  </div>
                  <TextInput
                    id="admin_email"
                    type="email"
                    icon={Mail}
                    placeholder="admin@company.com"
                    color={errors.admin_email || serverErrors.admin_email ? 'failure' : 'gray'}
                    {...register('admin_email')}
                  />
                  {(errors.admin_email || serverErrors.admin_email) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.admin_email?.message || serverErrors.admin_email?.[0]}
                    </p>
                  )}
                </div>

                {/* Admin Password */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="admin_password">Password (min 8 chars) *</Label>
                  </div>
                  <div className="relative">
                    <TextInput
                      id="admin_password"
                      type={showPassword ? 'text' : 'password'}
                      icon={Lock}
                      placeholder="••••••••"
                      color={errors.admin_password || serverErrors.admin_password ? 'failure' : 'gray'}
                      {...register('admin_password')}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {(errors.admin_password || serverErrors.admin_password) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.admin_password?.message || serverErrors.admin_password?.[0]}
                    </p>
                  )}
                </div>

                {/* Admin Password Confirmation */}
                <div>
                  <div className="mb-1 block">
                    <Label htmlFor="admin_password_confirmation">Confirm Password *</Label>
                  </div>
                  <div className="relative">
                    <TextInput
                      id="admin_password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      icon={Lock}
                      placeholder="••••••••"
                      color={errors.admin_password_confirmation || serverErrors.admin_password_confirmation ? 'failure' : 'gray'}
                      {...register('admin_password_confirmation')}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {(errors.admin_password_confirmation || serverErrors.admin_password_confirmation) && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.admin_password_confirmation?.message || serverErrors.admin_password_confirmation?.[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Building2 className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Provisioning Workspace...' : 'Create Company Workspace'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
