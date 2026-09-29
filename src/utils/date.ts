// src/utils/date.ts

export const formatDate = (
  value: string | Date | null | undefined,
  locale = "en-IN"
): string => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString(
    locale
  );
};

export const formatDateTime = (
  value: string | Date | null | undefined,
  locale = "en-IN"
): string => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString(
    locale
  );
};

export const toIsoDate = (
  value: string | Date
): string => {
  return new Date(value)
    .toISOString()
    .split("T")[0];
};