// src/utils/errorMapper.ts

export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Extracts the first string validation message for a given input field target.
 */
export const getFieldError = (error: any, fieldName: string): string | null => {
  if (!error || !error.data) return null;
  
  const laravelError = error.data as LaravelValidationError;
  
  if (laravelError.errors && laravelError.errors[fieldName]) {
    return laravelError.errors[fieldName][0]; // Extract the very first rule validation failure message string
  }
  
  return null;
};
