import { filterHiddenFields } from './filterHiddenFields';
import { FieldConfig, FormValues } from '@zetta/types';
import { describe, it, expect } from 'vitest';

describe('filterHiddenFields', () => {
  const fields: FieldConfig[] = [
    {
      id: 'visibleField',
      type: 'text',
      label: 'Visible',
    },
    {
      id: 'conditionalField',
      type: 'text',
      label: 'Conditional',
      visibility: {
        conditions: [
          { field: 'visibleField', operator: 'equals', value: 'show' },
        ],
      },
    },
  ];

  it('should include visible fields', () => {
    const values: FormValues = {
      visibleField: 'hide',
      conditionalField: 'hiddenData',
    };
    const result = filterHiddenFields(fields, values);

    expect(result).toHaveProperty('visibleField', 'hide');
  });

  it('should exclude hidden fields based on visibility rules', () => {
    const values: FormValues = {
      visibleField: 'hide',
      conditionalField: 'hiddenData',
    };
    const result = filterHiddenFields(fields, values);

    expect(result).not.toHaveProperty('conditionalField');
  });

  it('should include conditional fields when condition matches', () => {
    const values: FormValues = {
      visibleField: 'show',
      conditionalField: 'visibleData',
    };
    const result = filterHiddenFields(fields, values);

    expect(result).toHaveProperty('visibleField', 'show');
    expect(result).toHaveProperty('conditionalField', 'visibleData');
  });
});
