// src/utils/money.ts

export const number = (
  value: string | number | null | undefined
): number => {
  const num = Number(value);

  return Number.isNaN(num)
    ? 0
    : num;
};

export const formatNumber = (
  value: string | number,
  locale = "en-IN"
): string => {
  return number(value).toLocaleString(
    locale
  );
};

export const percentage = (
  value: string | number,
  decimals = 2
): string => {
  return `${number(value).toFixed(
    decimals
  )}%`;
};