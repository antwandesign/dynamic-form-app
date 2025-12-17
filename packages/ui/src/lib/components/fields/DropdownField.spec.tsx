import { render, screen } from '@testing-library/react';
import { DropdownField } from './DropdownField';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@zetta/primitives', () => ({
  Select: ({ label, options, ...props }: any) => (
    <select aria-label={label} {...props}>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    register: vi.fn(),
    formState: { errors: {} },
  }),
}));

describe('DropdownField Component', () => {
  it('should render select', () => {
    const field = {
      id: 'test',
      type: 'dropdown' as const,
      label: 'Test Dropdown',
      options: [{ label: 'A', value: 'a' }],
    };
    render(<DropdownField field={field} path="" />);
    expect(screen.getByLabelText('Test Dropdown')).toBeTruthy();
    expect(screen.getByText('A')).toBeTruthy();
  });
});
