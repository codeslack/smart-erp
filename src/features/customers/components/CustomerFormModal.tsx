import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Checkbox,
} from 'flowbite-react';
import { Loader2 } from 'lucide-react';
import { customerSchema } from '../customerValidation';
import type { CustomerFormData } from '../customerValidation';
import { customerService } from '../customerService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { Customer, CreateCustomerRequest } from '@/types/customer';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customer,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(customer?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      code: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      country_code: '',
      state_code: '',
      tax_number: '',
      credit_days: 0,
      credit_limit: 0,
      credit_control: 'none',
      is_active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setServerErrors({});
      if (customer) {
        reset({
          name: customer.name || '',
          code: customer.code || '',
          contact_person: customer.contact_person || '',
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
          country_code: customer.country_code || '',
          state_code: customer.state_code || '',
          tax_number: customer.tax_number || '',
          credit_days: customer.credit_days ?? 0,
          credit_limit: customer.credit_limit ?? 0,
          credit_control: customer.credit_control || 'none',
          is_active: customer.is_active ?? true,
        });
      } else {
        reset({
          name: '',
          code: '',
          contact_person: '',
          phone: '',
          email: '',
          address: '',
          country_code: '',
          state_code: '',
          tax_number: '',
          credit_days: 0,
          credit_limit: 0,
          credit_control: 'none',
          is_active: true,
        });
      }
    }
  }, [isOpen, customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: CreateCustomerRequest = {
        name: data.name.trim(),
        code: data.code?.trim() || null,
        contact_person: data.contact_person?.trim() || null,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        address: data.address?.trim() || null,
        country_code: data.country_code?.trim() || null,
        state_code: data.state_code?.trim() || null,
        tax_number: data.tax_number?.trim() || null,
        credit_days: data.credit_days !== undefined && data.credit_days !== null ? Number(data.credit_days) : null,
        credit_limit: data.credit_limit !== undefined && data.credit_limit !== null ? Number(data.credit_limit) : null,
        credit_control: data.credit_control,
        is_active: data.is_active,
      };

      if (isEditing && customer?.uuid) {
        await customerService.updateCustomer(customer.uuid, payload);
        dispatch(
          addToast({
            title: 'Customer Updated',
            message: `Customer ${data.name} was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await customerService.createCustomer(payload);
        dispatch(
          addToast({
            title: 'Customer Created',
            message: `Customer ${data.name} was successfully created.`,
            type: 'success',
          })
        );
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const fieldErrors = extractValidationErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        setServerErrors(fieldErrors);
      } else {
        dispatch(
          addToast({
            title: 'Operation Failed',
            message: getErrorMessage(err),
            type: 'error',
          })
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        {isEditing ? 'Edit Customer' : 'Create New Customer'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Customer Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="cust-name">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="cust-name"
                placeholder="e.g. Acme Corporation"
                className="mt-1"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
              {serverErrors.name && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.name[0]}</p>
              )}
            </div>

            {/* Customer Code */}
            <div>
              <Label htmlFor="cust-code">
                Customer Code <span className="text-xs text-gray-500">(Auto if blank)</span>
              </Label>
              <TextInput
                id="cust-code"
                placeholder="e.g. CUST-0001"
                className="mt-1"
                {...register('code')}
              />
              {errors.code && (
                <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>
              )}
              {serverErrors.code && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.code[0]}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <Label htmlFor="cust-contact">Contact Person</Label>
              <TextInput
                id="cust-contact"
                placeholder="Primary account contact"
                className="mt-1"
                {...register('contact_person')}
              />
              {errors.contact_person && (
                <p className="mt-1 text-xs text-red-600">{errors.contact_person.message}</p>
              )}
              {serverErrors.contact_person && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.contact_person[0]}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="cust-email">Email Address</Label>
              <TextInput
                id="cust-email"
                type="email"
                placeholder="billing@example.com"
                className="mt-1"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
              {serverErrors.email && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.email[0]}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="cust-phone">Phone Number</Label>
              <TextInput
                id="cust-phone"
                placeholder="+1 555-0199"
                className="mt-1"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
              {serverErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.phone[0]}</p>
              )}
            </div>

            {/* Tax Number */}
            <div>
              <Label htmlFor="cust-tax">Tax / GST / VAT Number</Label>
              <TextInput
                id="cust-tax"
                placeholder="e.g. 29AAAAA0000A1Z5"
                className="mt-1"
                {...register('tax_number')}
              />
              {errors.tax_number && (
                <p className="mt-1 text-xs text-red-600">{errors.tax_number.message}</p>
              )}
              {serverErrors.tax_number && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.tax_number[0]}</p>
              )}
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="cust-country">Country Code</Label>
                <TextInput
                  id="cust-country"
                  placeholder="US"
                  maxLength={2}
                  className="mt-1 uppercase"
                  {...register('country_code')}
                />
              </div>
              <div>
                <Label htmlFor="cust-state">State Code</Label>
                <TextInput
                  id="cust-state"
                  placeholder="CA"
                  className="mt-1 uppercase"
                  {...register('state_code')}
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="sm:col-span-2">
              <Label htmlFor="cust-address">Street Address</Label>
              <Textarea
                id="cust-address"
                placeholder="Street address, Suite, City, Zip"
                rows={2}
                className="mt-1"
                {...register('address')}
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>

            {/* Financial & Credit Control */}
            <div>
              <Label htmlFor="cust-credit-limit">Credit Limit ($)</Label>
              <TextInput
                id="cust-credit-limit"
                type="number"
                step="any"
                min={0}
                className="mt-1"
                {...register('credit_limit', { valueAsNumber: true })}
              />
              {errors.credit_limit && (
                <p className="mt-1 text-xs text-red-600">{errors.credit_limit.message}</p>
              )}
              {serverErrors.credit_limit && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.credit_limit[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cust-credit-days">Credit Days</Label>
              <TextInput
                id="cust-credit-days"
                type="number"
                min={0}
                className="mt-1"
                {...register('credit_days', { valueAsNumber: true })}
              />
              {errors.credit_days && (
                <p className="mt-1 text-xs text-red-600">{errors.credit_days.message}</p>
              )}
              {serverErrors.credit_days && (
                <p className="mt-1 text-xs text-red-600">{serverErrors.credit_days[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cust-credit-control">Credit Control Policy</Label>
              <Select id="cust-credit-control" className="mt-1" {...register('credit_control')}>
                <option value="none">No Control (Allow exceeding)</option>
                <option value="warn">Warning on excess</option>
                <option value="block">Block transactions on excess</option>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="cust-active" {...register('is_active')} />
              <Label htmlFor="cust-active" className="cursor-pointer">
                Customer is Active
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button color="gray" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
