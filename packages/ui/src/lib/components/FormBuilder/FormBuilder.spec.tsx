import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormBuilder } from './FormBuilder';
import { FormSchema } from '@zetta/types';
import { vi, describe, it, expect } from 'vitest';

// Mock dependencies
vi.mock('@zetta/form-core', async () => {
  const actual = await vi.importActual('@zetta/form-core');
  return {
    ...actual,
    useAutoSave: vi.fn(),
    buildDefaultValues: () => ({}),
    filterHiddenFields: (_: any, data: any) => data,
  };
});

// Mock react-hook-form
vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: () => ({
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault();
        fn({ name: 'Mocked Data' }); // Always submit this mock data
      },
      reset: vi.fn(),
      control: {},
      watch: vi.fn(),
    }),
    FormProvider: ({ children }: any) => <div>{children}</div>,
  };
});

vi.mock('../FieldRenderer/FieldRenderer', () => ({
  FieldRenderer: ({ field }: any) => (
    <div>
      <label htmlFor={field.id}>{field.label}</label>
      <input id={field.id} defaultValue="" />
    </div>
  ),
}));

vi.mock('./ApiIntegrationHandler', () => ({
  ApiIntegrationHandler: () => null,
}));

describe('FormBuilder Component', () => {
  const mockSchema: FormSchema = {
    title: 'Test Form',
    description: 'This is a test form',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your name',
        validations: [{ required: true, message: 'Name is required' }],
      },
      {
        id: 'email',
        type: 'text',
        label: 'Email Address',
        inputType: 'email',
      },
    ],
  };

  const mockOnSubmit = vi.fn();

  it('should render form title and description', () => {
    render(<FormBuilder schema={mockSchema} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Test Form')).toBeDefined();
    expect(screen.getByText('This is a test form')).toBeDefined();
  });

  it('should render fields defined in schema', () => {
    render(<FormBuilder schema={mockSchema} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Full Name')).toBeDefined();
    expect(screen.getByLabelText('Email Address')).toBeDefined();
  });

  it('should handle form submission', async () => {
    render(<FormBuilder schema={mockSchema} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Mocked Data',
        })
      );
    });
  });
});
