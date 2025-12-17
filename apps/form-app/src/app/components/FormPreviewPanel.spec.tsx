import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormPreviewPanel } from './FormPreviewPanel';

vi.mock('@zetta/ui', () => ({
  FormBuilder: ({ schema }: { schema: { title: string } }) => (
    <div data-testid="form-builder">FormBuilder: {schema.title}</div>
  ),
}));

vi.mock('@zetta/form-core', () => ({
  getSavedFormData: vi.fn(() => null),
}));

describe('FormPreviewPanel', () => {
  const defaultProps = {
    schema: null,
    hasErrors: false,
    jsonInput: '',
    onSubmit: vi.fn(),
  };

  it('should render the section title', () => {
    render(<FormPreviewPanel {...defaultProps} />);
    expect(screen.getByText('Preview')).toBeTruthy();
  });

  it('should not render FormBuilder when schema is null', () => {
    render(<FormPreviewPanel {...defaultProps} schema={null} />);
    expect(screen.queryByTestId('form-builder')).toBeNull();
  });

  it('should not render FormBuilder when hasErrors is true', () => {
    render(
      <FormPreviewPanel
        {...defaultProps}
        schema={{ title: 'Test', fields: [] }}
        hasErrors={true}
      />
    );
    expect(screen.queryByTestId('form-builder')).toBeNull();
  });

  it('should not render FormBuilder when schema has no fields', () => {
    render(
      <FormPreviewPanel
        {...defaultProps}
        schema={{ title: 'Test', fields: undefined as unknown as [] }}
      />
    );
    expect(screen.queryByTestId('form-builder')).toBeNull();
  });

  it('should render FormBuilder when schema is valid and no errors', () => {
    render(
      <FormPreviewPanel
        {...defaultProps}
        schema={{ title: 'My Form', fields: [] }}
        hasErrors={false}
      />
    );
    expect(screen.getByTestId('form-builder')).toBeTruthy();
    expect(screen.getByText('FormBuilder: My Form')).toBeTruthy();
  });
});
