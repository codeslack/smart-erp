// src/utils/currency.ts

import { money } from "./money";

export const formatCurrency = (
  value: string | number | null | undefined,
  currencySymbol = "₹ ",
  locale = "en-IN"
): string => {
  return `${currencySymbol}${money(
    value
  ).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyWithoutSymbol = (
  value: string | number | null | undefined,
  locale = "en-IN"
): string => {
  return money(value).toLocaleString(
    locale,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
};

export const formatAccountingCurrency = (
  value: string | number | null | undefined,
  currencySymbol = "₹ ",
  locale = "en-IN"
): string => {
  const amount = money(value);

  if (amount < 0) {
    return `(${currencySymbol}${Math.abs(
      amount
    ).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })})`;
  }

  return formatCurrency(
    amount,
    currencySymbol,
    locale
  );
};