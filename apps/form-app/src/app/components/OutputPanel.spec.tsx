import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutputPanel } from './OutputPanel';

describe('OutputPanel', () => {
  it('should render the section title', () => {
    render(<OutputPanel submittedData={null} />);
    expect(screen.getByText('Result')).toBeTruthy();
  });

  it('should display placeholder when no data is submitted', () => {
    render(<OutputPanel submittedData={null} />);
    expect(
      screen.getByText('Submit the form to see the JSON output here')
    ).toBeTruthy();
  });

  it('should display submitted data as JSON', () => {
    const data = { name: 'John', email: 'john@example.com' };
    render(<OutputPanel submittedData={data} />);

    const pre = screen.getByText(/"name": "John"/);
    expect(pre).toBeTruthy();
  });

  it('should not display placeholder when data is present', () => {
    const data = { name: 'Test' };
    render(<OutputPanel submittedData={data} />);

    expect(
      screen.queryByText('Submit the form to see the JSON output here')
    ).toBeNull();
  });

  it('should handle nested data structures', () => {
    const data = {
      user: { name: 'Alice' },
      active: true,
    };
    render(<OutputPanel submittedData={data} />);

    expect(screen.getByText(/"user":/)).toBeTruthy();
  });
});
