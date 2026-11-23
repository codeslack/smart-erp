export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'USD',
  locale = 'en-US'
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return '$0.00';
  }

  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `$${numericValue.toFixed(2)}`;
  }
}

export function formatNumber(
  value: number | string | null | undefined,
  decimals = 2,
  locale = 'en-US'
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue);
}

export function formatPercentage(value: number | string | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0%';
  }
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numericValue.toFixed(decimals)}%`;
}

export function truncateText(text: string | null | undefined, maxLength = 30): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
