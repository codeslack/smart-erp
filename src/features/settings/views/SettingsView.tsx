import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Button, Label, TextInput, Select } from 'flowbite-react';
import { Save, RefreshCw, Loader2, Building, Globe } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { settingsService, type TenantCompanySettings } from '../settingsService';
import { getErrorMessage } from '@/utils/errors';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

export const SettingsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<TenantCompanySettings>({
    defaultValues: {
      name: '',
      legal_name: '',
      email: '',
      phone: '',
      tax_number: '',
      currency: 'USD',
      timezone: 'UTC',
      address: '',
      city: '',
      state: '',
      country: '',
    },
  });

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await settingsService.getSettings('company');
      if (res.data) {
        reset(res.data);
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: TenantCompanySettings) => {
    try {
      setIsSaving(true);
      await settingsService.updateSettings('company', data);
      dispatch(
        addToast({
          title: 'Settings Saved',
          message: 'Company configuration and preferences have been updated.',
          type: 'success',
        })
      );
    } catch (err: any) {
      dispatch(
        addToast({
          title: 'Update Failed',
          message: getErrorMessage(err),
          type: 'error',
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System & Company Settings"
        subtitle="Manage organization identity, localization parameters, and accounting currency."
        breadcrumbs={[{ label: 'System' }, { label: 'Settings' }]}
        actions={
          <Button color="light" onClick={fetchSettings} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Reload Settings
          </Button>
        }
      />

      {error ? (
        <ErrorState
          title="Failed to Load Settings"
          message={error}
          onRetry={fetchSettings}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
          <Card>
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <Building className="h-5 w-5 text-primary-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Organization Profile
                </h3>
                <p className="text-xs text-gray-500">
                  Legal company identity displayed on invoices, purchase orders, and financial statements.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="comp-name">Company Trade Name *</Label>
                <TextInput id="comp-name" placeholder="Acme Inc." className="mt-1" {...register('name')} />
              </div>
              <div>
                <Label htmlFor="comp-legal-name">Legal / Registered Name</Label>
                <TextInput id="comp-legal-name" placeholder="Acme Technologies LLC" className="mt-1" {...register('legal_name')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="comp-email">Official Email</Label>
                <TextInput id="comp-email" type="email" placeholder="contact@acme.com" className="mt-1" {...register('email')} />
              </div>
              <div>
                <Label htmlFor="comp-phone">Official Phone</Label>
                <TextInput id="comp-phone" placeholder="+1 (555) 123-4567" className="mt-1" {...register('phone')} />
              </div>
              <div>
                <Label htmlFor="comp-tax-number">Tax Registration / VAT #</Label>
                <TextInput id="comp-tax-number" placeholder="VAT-987654321" className="mt-1" {...register('tax_number')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="comp-address">Street Address</Label>
                <TextInput id="comp-address" placeholder="123 Business Avenue, Suite 400" className="mt-1" {...register('address')} />
              </div>
              <div>
                <Label htmlFor="comp-city">City</Label>
                <TextInput id="comp-city" placeholder="San Francisco" className="mt-1" {...register('city')} />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <Globe className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Regional & Accounting Localization
                </h3>
                <p className="text-xs text-gray-500">
                  Base operating currency, timezone, and fiscal calendar presets.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <Label htmlFor="comp-currency">Primary Base Currency</Label>
                <Select id="comp-currency" className="mt-1" {...register('currency')}>
                  <option value="USD">USD - United States Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="INR">INR - Indian Rupee (₹)</option>
                  <option value="CAD">CAD - Canadian Dollar ($)</option>
                  <option value="AUD">AUD - Australian Dollar ($)</option>
                  <option value="AED">AED - UAE Dirham (AED)</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="comp-timezone">System Timezone</Label>
                <Select id="comp-timezone" className="mt-1" {...register('timezone')}>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">America/New York (EST/EDT)</option>
                  <option value="America/Los_Angeles">America/Los Angeles (PST/PDT)</option>
                  <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                  <option value="Europe/London">Europe/London (GMT/BST)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                </Select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Company Settings
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
