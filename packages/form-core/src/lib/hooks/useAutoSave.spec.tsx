import { renderHook, act } from '@testing-library/react';
import { useAutoSave, getSavedFormData } from './useAutoSave';
import { useFormContext } from 'react-hook-form';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useFormContext: vi.fn(),
}));

describe('useAutoSave Hook', () => {
  const schemaId = 'test-schema';
  const mockWatch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useFormContext).mockReturnValue({
      watch: mockWatch,
    } as any);

    // Clear localStorage before each test
    localStorage.clear();
    mockWatch.mockImplementation((cb) => {
      // Return a dummy subscription object
      return {
        unsubscribe: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should save data to localStorage after debounce', () => {
    let watchCallback: (data: any) => void;
    mockWatch.mockImplementation((cb) => {
      watchCallback = cb;
      return { unsubscribe: vi.fn() };
    });

    renderHook(() => useAutoSave(schemaId));

    const testData = { name: 'John Doe' };

    // Simulate form change
    act(() => {
      if (watchCallback) {
        watchCallback(testData);
      }
    });

    // Should not be saved yet due to debounce
    expect(getSavedFormData(schemaId)).toBeNull();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(getSavedFormData(schemaId)).toEqual(testData);
  });

  it('should clear saved data when clearSavedData is called', () => {
    // Setup existing data
    const testData = { name: 'Existing' };
    const key = `zetta-form-autosave-${schemaId}`;
    localStorage.setItem(key, JSON.stringify(testData));

    const { result } = renderHook(() => useAutoSave(schemaId));

    act(() => {
      result.current.clearSavedData();
    });

    expect(getSavedFormData(schemaId)).toBeNull();
  });

  it('should respect custom debounceMs option', () => {
    let watchCallback: (data: any) => void;
    mockWatch.mockImplementation((cb) => {
      watchCallback = cb;
      return { unsubscribe: vi.fn() };
    });

    renderHook(() => useAutoSave(schemaId, { debounceMs: 1000 }));

    const testData = { name: 'Slow Save' };

    act(() => {
      if (watchCallback) {
        watchCallback(testData);
      }
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });
    // Should NOT be saved yet
    expect(getSavedFormData(schemaId)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(700);
    });
    // Should be saved now
    expect(getSavedFormData(schemaId)).toEqual(testData);
  });
});
