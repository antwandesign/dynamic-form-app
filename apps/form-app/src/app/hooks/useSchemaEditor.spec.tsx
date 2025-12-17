import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchemaEditor } from './useSchemaEditor';

vi.mock('@zetta/form-core', () => ({
  validateFormSchema: vi.fn((json: string) => {
    try {
      const parsed = JSON.parse(json);
      if (parsed.title && parsed.fields) {
        return { valid: true, errors: [], schema: parsed };
      }
      return {
        valid: false,
        errors: ['/: must have required property "title"'],
      };
    } catch {
      return { valid: false, errors: ['Invalid JSON: Unexpected token'] };
    }
  }),
  validateFormSchemaObject: vi.fn((obj: unknown) => {
    const o = obj as Record<string, unknown>;
    if (o?.title && o?.fields) {
      return { valid: true, errors: [], schema: obj };
    }
    return { valid: false, errors: ['/: must have required property "title"'] };
  }),
}));

vi.mock('../../schemas/schemas', () => ({
  SCHEMA_OPTIONS: [
    { id: 'test', name: 'Test Schema', schema: { title: 'Test', fields: [] } },
  ],
}));

// Helper to create mock change event
function createTextareaEvent(value: string) {
  return {
    target: { value },
  } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
}

function createSelectEvent(value: string) {
  return {
    target: { value },
  } as unknown as React.ChangeEvent<HTMLSelectElement>;
}

describe('useSchemaEditor', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with empty state when localStorage is empty', () => {
    const { result } = renderHook(() => useSchemaEditor());

    expect(result.current.jsonInput).toBe('');
    expect(result.current.schema).toBeNull();
    expect(result.current.parseError).toBeNull();
    expect(result.current.validationErrors).toEqual([]);
    expect(result.current.hasErrors).toBe(false);
  });

  it('should restore schema from localStorage on init', () => {
    const validSchema = JSON.stringify({ title: 'Saved', fields: [] });
    localStorage.setItem('zetta-schema-input', validSchema);

    const { result } = renderHook(() => useSchemaEditor());

    expect(result.current.jsonInput).toBe(validSchema);
    expect(result.current.schema).toEqual({ title: 'Saved', fields: [] });
  });

  it('should update schema when valid JSON is entered', () => {
    const { result } = renderHook(() => useSchemaEditor());

    act(() => {
      result.current.handleJsonChange(
        createTextareaEvent('{"title":"New Form","fields":[]}')
      );
    });

    expect(result.current.schema).toEqual({ title: 'New Form', fields: [] });
    expect(result.current.parseError).toBeNull();
    expect(result.current.hasErrors).toBe(false);
  });

  it('should set parseError when invalid JSON is entered', () => {
    const { result } = renderHook(() => useSchemaEditor());

    act(() => {
      result.current.handleJsonChange(createTextareaEvent('{ invalid json }'));
    });

    expect(result.current.schema).toBeNull();
    expect(result.current.parseError).toBeTruthy();
    expect(result.current.hasErrors).toBe(true);
  });

  it('should set validationErrors when schema is invalid', () => {
    const { result } = renderHook(() => useSchemaEditor());

    act(() => {
      result.current.handleJsonChange(createTextareaEvent('{"foo":"bar"}'));
    });

    expect(result.current.schema).toBeNull();
    expect(result.current.validationErrors.length).toBeGreaterThan(0);
    expect(result.current.hasErrors).toBe(true);
  });

  it('should handle schema selection from dropdown', () => {
    const { result } = renderHook(() => useSchemaEditor());

    act(() => {
      result.current.handleSchemaSelect(createSelectEvent('test'));
    });

    expect(result.current.schema).toEqual({ title: 'Test', fields: [] });
    expect(result.current.hasErrors).toBe(false);
  });
});
