import { useState, useCallback, useEffect } from 'react';
import { FormSchema } from '@zetta/types';
import { validateFormSchema, validateFormSchemaObject } from '@zetta/form-core';
import { SCHEMA_OPTIONS } from '../../schemas/schemas';

const SCHEMA_STORAGE_KEY = 'zetta-schema-input';

export interface UseSchemaEditorResult {
  jsonInput: string;
  schema: FormSchema | null;
  parseError: string | null;
  validationErrors: string[];
  hasErrors: boolean;
  handleJsonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSchemaSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function useSchemaEditor(): UseSchemaEditorResult {
  const [jsonInput, setJsonInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SCHEMA_STORAGE_KEY);
      return saved || '';
    } catch {
      return '';
    }
  });

  const [schema, setSchema] = useState<FormSchema | null>(() => {
    try {
      const saved = localStorage.getItem(SCHEMA_STORAGE_KEY);
      if (saved) {
        const result = validateFormSchema(saved);
        if (result.valid && result.schema) {
          return result.schema;
        }
      }
    } catch {
      // Ignore parse errors on initial load
    }
    return null;
  });

  const [parseError, setParseError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Auto-save schema to localStorage with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(SCHEMA_STORAGE_KEY, jsonInput);
      } catch (error) {
        console.warn('Failed to save schema to localStorage:', error);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [jsonInput]);

  const handleSchemaSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const schemaId = e.target.value;
      const selectedOption = SCHEMA_OPTIONS.find((opt) => opt.id === schemaId);

      if (selectedOption) {
        const result = validateFormSchemaObject(selectedOption.schema);
        if (result.valid && result.schema) {
          const schemaJson = JSON.stringify(result.schema, null, 2);
          setJsonInput(schemaJson);
          setSchema(result.schema);
          setParseError(null);
          setValidationErrors([]);
        } else {
          setValidationErrors(result.errors);
        }
      }
    },
    []
  );

  const handleJsonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setJsonInput(value);

      const result = validateFormSchema(value);

      if (result.valid && result.schema) {
        setSchema(result.schema);
        setParseError(null);
        setValidationErrors([]);
      } else {
        setSchema(null);
        if (result.errors.some((e) => e.startsWith('Invalid JSON:'))) {
          setParseError(result.errors[0].replace('Invalid JSON: ', ''));
          setValidationErrors([]);
        } else {
          setParseError(null);
          setValidationErrors(result.errors);
        }
      }
    },
    []
  );

  const hasErrors = parseError !== null || validationErrors.length > 0;

  return {
    jsonInput,
    schema,
    parseError,
    validationErrors,
    hasErrors,
    handleJsonChange,
    handleSchemaSelect,
  };
}
