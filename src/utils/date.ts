import { format, parseISO, isValid } from 'date-fns';

export function formatDate(date: string | number | Date | null | undefined, pattern = 'dd MMM yyyy'): string {
  if (!date) return '-';

  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(parsed)) return '-';
    return format(parsed, pattern);
  } catch {
    return '-';
  }
}

export function formatDateTime(date: string | number | Date | null | undefined): string {
  return formatDate(date, 'dd MMM yyyy, hh:mm a');
}

export function toInputDateFormat(date: string | number | Date | null | undefined): string {
  if (!date) return '';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    if (!isValid(parsed)) return '';
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    return '';
  }
}
