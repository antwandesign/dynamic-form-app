import { render, screen } from '@testing-library/react';
import { Select } from './Select';
import { describe, it, expect } from 'vitest';

describe('Select Primitive', () => {
  it('should render label and options', () => {
    const options = [{ label: 'Opt 1', value: '1' }];
    render(<Select id="sel" label="Dropdown" options={options} />);
    expect(screen.getByLabelText('Dropdown')).toBeTruthy();
    expect(screen.getByText('Opt 1')).toBeTruthy();
  });
});
