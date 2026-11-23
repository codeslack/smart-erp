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
import { supplierSchema } from '../supplierValidation';
import type { SupplierFormData } from '../supplierValidation';
import { supplierService } from '../supplierService';
import { extractValidationErrors, getErrorMessage } from '@/utils/errors';
import type { Supplier, CreateSupplierRequest } from '@/types/supplier';
import { useAppDispatch } from '@/app/hooks';
import { addToast } from '@/features/notifications/notificationSlice';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier?: Supplier | null;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  supplier,
}) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const isEditing = Boolean(supplier?.uuid);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      code: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
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
      if (supplier) {
        reset({
          name: supplier.name || '',
          code: supplier.code || '',
          contact_person: supplier.contact_person || '',
          phone: supplier.phone || '',
          email: supplier.email || '',
          address: supplier.address || '',
          tax_number: supplier.tax_number || '',
          credit_days: supplier.credit_days ?? 0,
          credit_limit: supplier.credit_limit ?? 0,
          credit_control: supplier.credit_control || 'none',
          is_active: supplier.is_active ?? true,
        });
      } else {
        reset({
          name: '',
          code: '',
          contact_person: '',
          phone: '',
          email: '',
          address: '',
          tax_number: '',
          credit_days: 0,
          credit_limit: 0,
          credit_control: 'none',
          is_active: true,
        });
      }
    }
  }, [isOpen, supplier, reset]);

  const onSubmit = async (data: SupplierFormData) => {
    try {
      setIsSubmitting(true);
      setServerErrors({});

      const payload: CreateSupplierRequest = {
        name: data.name.trim(),
        code: data.code?.trim() || null,
        contact_person: data.contact_person?.trim() || null,
        phone: data.phone?.trim() || null,
        email: data.email?.trim() || null,
        address: data.address?.trim() || null,
        tax_number: data.tax_number?.trim() || null,
        credit_days: data.credit_days !== undefined && data.credit_days !== null ? Number(data.credit_days) : null,
        credit_limit: data.credit_limit !== undefined && data.credit_limit !== null ? Number(data.credit_limit) : null,
        credit_control: data.credit_control,
        is_active: data.is_active,
      };

      if (isEditing && supplier?.uuid) {
        await supplierService.updateSupplier(supplier.uuid, payload);
        dispatch(
          addToast({
            title: 'Supplier Updated',
            message: `Supplier ${data.name} was successfully updated.`,
            type: 'success',
          })
        );
      } else {
        await supplierService.createSupplier(payload);
        dispatch(
          addToast({
            title: 'Supplier Created',
            message: `Supplier ${data.name} was successfully created.`,
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
        {isEditing ? 'Edit Supplier' : 'Create New Supplier'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Supplier Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="supp-name">
                Supplier Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="supp-name"
                placeholder="e.g. Apex Hardware Supplies"
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

            {/* Supplier Code */}
            <div>
              <Label htmlFor="supp-code">
                Supplier Code <span className="text-xs text-gray-500">(Auto if blank)</span>
              </Label>
              <TextInput
                id="supp-code"
                placeholder="e.g. SUPP-0001"
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
              <Label htmlFor="supp-contact">Contact Person</Label>
              <TextInput
                id="supp-contact"
                placeholder="Account representative"
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
              <Label htmlFor="supp-email">Email Address</Label>
              <TextInput
                id="supp-email"
                type="email"
                placeholder="orders@vendor.com"
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
              <Label htmlFor="supp-phone">Phone Number</Label>
              <TextInput
                id="supp-phone"
                placeholder="+1 555-0188"
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
            <div className="sm:col-span-2">
              <Label htmlFor="supp-tax">Tax / GST / VAT Number</Label>
              <TextInput
                id="supp-tax"
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

            {/* Billing Address */}
            <div className="sm:col-span-2">
              <Label htmlFor="supp-address">Vendor Street Address</Label>
              <Textarea
                id="supp-address"
                placeholder="Warehouse or office address"
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
              <Label htmlFor="supp-credit-limit">Credit Limit ($)</Label>
              <TextInput
                id="supp-credit-limit"
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
              <Label htmlFor="supp-credit-days">Credit Days</Label>
              <TextInput
                id="supp-credit-days"
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
              <Label htmlFor="supp-credit-control">Credit Control Policy</Label>
              <Select id="supp-credit-control" className="mt-1" {...register('credit_control')}>
                <option value="none">No Control</option>
                <option value="warn">Warning on excess</option>
                <option value="block">Block transactions on excess</option>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <Checkbox id="supp-active" {...register('is_active')} />
              <Label htmlFor="supp-active" className="cursor-pointer">
                Supplier is Active
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
            <Button color="gray" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Supplier'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};
