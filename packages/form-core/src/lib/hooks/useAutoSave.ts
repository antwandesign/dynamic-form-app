import { useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@zetta/types';
import { validateFormValues } from '../utils/schemaValidator';

const STORAGE_KEY_PREFIX = 'zetta-form-autosave-';

// Maximum allowed size for form data (1MB)
const MAX_FORM_DATA_SIZE_BYTES = 1 * 1024 * 1024;

/**
 * Safely parses JSON and validates the structure as FormValues.
 * Returns null if parsing fails or data is invalid.
 */
function safeParseFormData(jsonString: string): FormValues | null {
  try {
    const parsed: unknown = JSON.parse(jsonString);

    // Validate that parsed data is a valid FormValues structure
    if (!validateFormValues(parsed)) {
      console.warn('Invalid form data structure in localStorage');
      return null;
    }

    return parsed as FormValues;
  } catch {
    return null;
  }
}

export function getSavedFormData(schemaId: string): FormValues | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${schemaId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return safeParseFormData(saved);
    }
  } catch (error) {
    console.warn('Failed to load saved form data:', error);
  }
  return null;
}

export function clearSavedFormData(schemaId: string): void {
  try {
    const key = `${STORAGE_KEY_PREFIX}${schemaId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear saved form data:', error);
  }
}

interface UseAutoSaveOptions {
  debounceMs?: number;
}

export function useAutoSave(
  schemaId: string,
  options: UseAutoSaveOptions = {}
): { clearSavedData: () => void } {
  const { debounceMs = 300 } = options;
  const { watch } = useFormContext();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveToStorage = useCallback(
    (data: FormValues) => {
      try {
        // Validate data structure before saving
        if (!validateFormValues(data)) {
          console.warn('Attempted to save invalid form data structure');
          return;
        }

        const jsonString = JSON.stringify(data);

        // Check size limit
        const byteSize = new Blob([jsonString]).size;
        if (byteSize > MAX_FORM_DATA_SIZE_BYTES) {
          console.warn(
            `Form data exceeds maximum size of ${
              MAX_FORM_DATA_SIZE_BYTES / 1024 / 1024
            }MB. Not saving.`
          );
          return;
        }

        const key = `${STORAGE_KEY_PREFIX}${schemaId}`;
        localStorage.setItem(key, jsonString);
      } catch (error) {
        // Handle quota exceeded error gracefully
        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          console.warn(
            'localStorage quota exceeded. Unable to save form data.'
          );
        } else {
          console.warn('Failed to save form data:', error);
        }
      }
    },
    [schemaId]
  );

  const clearSavedData = useCallback(() => {
    clearSavedFormData(schemaId);
  }, [schemaId]);

  useEffect(() => {
    const subscription = watch((data) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveToStorage(data as FormValues);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, saveToStorage, debounceMs]);

  return { clearSavedData };
}
