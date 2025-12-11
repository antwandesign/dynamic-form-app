import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { ApiIntegration } from '@zetta/types';
import {
  mockApiCall,
  MockApiEndpoint,
  VALID_ENDPOINTS,
} from '../services/mockApi';

export function useApiIntegration(apiIntegration?: ApiIntegration) {
  const { control, setValue } = useFormContext();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  const sourceFieldNames = useMemo(
    () => apiIntegration?.sourceFields || [],
    [apiIntegration?.sourceFields]
  );

  const sourceValues = useWatch({
    control,
    name: sourceFieldNames,
  });

  const triggerApiCall = useCallback(async () => {
    if (!apiIntegration) return;
    if (sourceFieldNames.length === 0) return;

    if (!isValidEndpoint(apiIntegration.endpoint)) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const payload: Record<string, string> = {};
    sourceFieldNames.forEach((fieldName, index) => {
      payload[fieldName] = sourceValues[index] as string;
    });

    try {
      const result = await mockApiCall(
        apiIntegration.endpoint as MockApiEndpoint,
        payload,
        abortControllerRef.current?.signal
      );

      if (!isMountedRef.current) return;

      if (result) {
        for (const targetField of apiIntegration.targetFields) {
          const resultKey = targetField.split('.').pop() || targetField;
          if (resultKey in result) {
            setValue(targetField, result[resultKey as keyof typeof result]);
          }
        }
      }
    } catch (error) {
      if (
        isMountedRef.current &&
        (error as Error).name !== 'AbortError' &&
        process.env.NODE_ENV !== 'production'
      ) {
        console.error('[API Integration] Error:', error);
      }
    }
  }, [apiIntegration, sourceFieldNames, sourceValues, setValue]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!apiIntegration) return;

    const allValuesPresent = sourceValues.every(
      (value) => value !== undefined && value !== null && value !== ''
    );

    if (!allValuesPresent) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const debounceMs = apiIntegration.debounceMs || 500;
    debounceTimerRef.current = setTimeout(() => {
      triggerApiCall();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [apiIntegration, sourceValues, triggerApiCall]);
}

function isValidEndpoint(endpoint: string): endpoint is MockApiEndpoint {
  return VALID_ENDPOINTS.includes(endpoint as MockApiEndpoint);
}
