import { render, screen } from '@testing-library/react';
import App from './App';
import { vi, describe, it, expect } from 'vitest';

// Mock dependencies that might cause issues in unit test
vi.mock('@zetta/ui', () => ({
  FormBuilder: () => <div>FormBuilder Mock</div>,
}));

describe('App', () => {
  it('should render welcome title', () => {
    render(<App />);
    expect(screen.getByText('Zetta Dynamic Form Generator')).toBeTruthy();
  });
});
