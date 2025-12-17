import { render, screen } from '@testing-library/react';
import { Checkbox } from './Checkbox';
import { describe, it, expect } from 'vitest';

describe('Checkbox Primitive', () => {
  it('should render correctly', () => {
    render(<Checkbox id="cb" label="Accept Terms" />);
    expect(screen.getByLabelText('Accept Terms')).toBeTruthy();
  });
});
