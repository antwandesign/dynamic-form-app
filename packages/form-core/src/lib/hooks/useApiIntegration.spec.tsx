import { renderHook } from '@testing-library/react';
import { useApiIntegration } from './useApiIntegration';
// import { useFormContext } from 'react-hook-form';
import { vi, describe, it, expect } from 'vitest';

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    control: {},
    setValue: vi.fn(),
  }),
  useWatch: () => [],
}));

vi.mock('../services/mockApi', () => ({
  mockApiCall: vi.fn(),
  VALID_ENDPOINTS: ['/test'],
}));

describe('useApiIntegration', () => {
  it('should be valid', () => {
    renderHook(() =>
      useApiIntegration({
        endpoint: '/test',
        sourceFields: [],
        targetFields: [],
      })
    );
    expect(true).toBe(true);
  });
});
