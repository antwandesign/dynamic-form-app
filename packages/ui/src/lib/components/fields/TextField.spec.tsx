import { render, screen } from '@testing-library/react';
import { TextField } from './TextField';
import { vi, describe, it, expect } from 'vitest';

// Mock dependencies
vi.mock('@zetta/primitives', () => ({
  Input: ({ label, ...props }: any) => <input aria-label={label} {...props} />,
}));

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    register: vi.fn(),
    formState: { errors: {} },
  }),
}));

describe('TextField Component', () => {
  it('should render input', () => {
    const field = { id: 'test', type: 'text' as const, label: 'Test Field' };
    render(<TextField field={field} path="" />);
    expect(screen.getByLabelText('Test Field')).toBeTruthy();
  });
});
