import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemaEditorPanel } from './SchemaEditorPanel';

describe('SchemaEditorPanel', () => {
  const defaultProps = {
    jsonInput: '',
    hasErrors: false,
    parseError: null,
    validationErrors: [],
    onJsonChange: vi.fn(),
  };

  it('should render the section title', () => {
    render(<SchemaEditorPanel {...defaultProps} />);
    expect(screen.getByText('JSON Schema')).toBeTruthy();
  });

  it('should render the textarea with placeholder', () => {
    render(<SchemaEditorPanel {...defaultProps} />);
    const textarea = screen.getByPlaceholderText(/Enter your JSON schema here/);
    expect(textarea).toBeTruthy();
  });

  it('should display jsonInput value in textarea', () => {
    render(<SchemaEditorPanel {...defaultProps} jsonInput='{"test": true}' />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe('{"test": true}');
  });

  it('should call onJsonChange when textarea value changes', () => {
    const mockOnChange = vi.fn();
    render(<SchemaEditorPanel {...defaultProps} onJsonChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should add error class when hasErrors is true', () => {
    render(<SchemaEditorPanel {...defaultProps} hasErrors={true} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.className).toContain('json-input-error');
  });

  it('should display parse error when present', () => {
    render(
      <SchemaEditorPanel {...defaultProps} parseError="Unexpected token" />
    );
    expect(screen.getByText('Parse Error:')).toBeTruthy();
    expect(screen.getByText('Unexpected token')).toBeTruthy();
  });

  it('should display validation errors when present', () => {
    render(
      <SchemaEditorPanel
        {...defaultProps}
        validationErrors={['Missing title', 'Missing fields']}
      />
    );
    expect(screen.getByText('Validation Errors:')).toBeTruthy();
    expect(screen.getByText('Missing title')).toBeTruthy();
    expect(screen.getByText('Missing fields')).toBeTruthy();
  });

  it('should not display error messages when there are no errors', () => {
    render(<SchemaEditorPanel {...defaultProps} />);
    expect(screen.queryByText('Parse Error:')).toBeNull();
    expect(screen.queryByText('Validation Errors:')).toBeNull();
  });
});
