import { render, screen } from '@testing-library/react';
import { CheckboxField } from './CheckboxField';
import { vi, describe, it, expect } from 'vitest';

vi.mock('@zetta/primitives', () => ({
  Checkbox: ({ label, ...props }: any) => (
    <input type="checkbox" aria-label={label} {...props} />
  ),
}));

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({
    register: vi.fn(),
    formState: { errors: {} },
  }),
}));

describe('CheckboxField Component', () => {
  it('should render checkbox', () => {
    const field = { id: 'test', type: 'checkbox' as const, label: 'Agree' };
    render(<CheckboxField field={field} path="" />);
    expect(screen.getByLabelText('Agree')).toBeTruthy();
  });
});
