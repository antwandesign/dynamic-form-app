import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from './AppHeader';

vi.mock('../../schemas/schemas', () => ({
  SCHEMA_OPTIONS: [
    { id: 'schema1', name: 'Schema One', schema: {} },
    { id: 'schema2', name: 'Schema Two', schema: {} },
  ],
}));

describe('AppHeader', () => {
  it('should render the title', () => {
    render(<AppHeader onSchemaSelect={vi.fn()} />);
    expect(screen.getByText('Zetta Dynamic Form Generator')).toBeTruthy();
  });

  it('should render the schema selector dropdown', () => {
    render(<AppHeader onSchemaSelect={vi.fn()} />);
    expect(screen.getByLabelText('Import:')).toBeTruthy();
    expect(screen.getByText('Select a schema...')).toBeTruthy();
  });

  it('should render all schema options', () => {
    render(<AppHeader onSchemaSelect={vi.fn()} />);
    expect(screen.getByText('Schema One')).toBeTruthy();
    expect(screen.getByText('Schema Two')).toBeTruthy();
  });

  it('should call onSchemaSelect when an option is selected', () => {
    const mockOnSchemaSelect = vi.fn();
    render(<AppHeader onSchemaSelect={mockOnSchemaSelect} />);

    const select = screen.getByLabelText('Import:');
    fireEvent.change(select, { target: { value: 'schema1' } });

    expect(mockOnSchemaSelect).toHaveBeenCalled();
  });
});
