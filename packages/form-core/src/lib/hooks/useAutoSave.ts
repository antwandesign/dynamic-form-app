import { useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@zetta/types';

const STORAGE_KEY_PREFIX = 'zetta-form-autosave-';

export function getSavedFormData(schemaId: string): FormValues | null {
  try {
    const key = `${STORAGE_KEY_PREFIX}${schemaId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as FormValues;
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
        const key = `${STORAGE_KEY_PREFIX}${schemaId}`;
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save form data:', error);
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
