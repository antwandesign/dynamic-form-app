import { render, screen } from '@testing-library/react';
import { Input } from './Input';
import { describe, it, expect } from 'vitest';

describe('Input Component', () => {
  it('should render successfully', () => {
    render(<Input id="test-input" label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeTruthy();
  });
});
