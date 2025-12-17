import { renderHook } from '@testing-library/react';
import { useDynamicValidation } from './useDynamicValidation';
// import { useFormContext } from 'react-hook-form';
import { vi, describe, it, expect } from 'vitest';

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    control: {},
  }),
  useWatch: () => [],
}));

describe('useDynamicValidation', () => {
  it('should be defined', () => {
    const { result } = renderHook(() =>
      useDynamicValidation([], { dependsOn: 'other', rules: {} })
    );
    expect(result.current).toBeDefined();
    expect(result.current).toEqual({});
  });
});
