import { buildDefaultValues } from './buildDefaultValues';
import { FieldConfig } from '@zetta/types';
import { describe, it, expect } from 'vitest';

describe('buildDefaultValues', () => {
  it('should extract default values from simple fields', () => {
    const fields: FieldConfig[] = [
      { id: 'f1', type: 'text', label: 'F1', defaultValue: 'default1' },
      { id: 'f2', type: 'checkbox', label: 'F2', defaultValue: true },
    ];
    const defaults = buildDefaultValues(fields);
    expect(defaults).toEqual({ f1: 'default1', f2: true });
  });

  it('should ignore fields without default values', () => {
    const fields: FieldConfig[] = [{ id: 'f1', type: 'text', label: 'F1' }];
    const defaults = buildDefaultValues(fields);
    expect(defaults).toEqual({});
  });
});
