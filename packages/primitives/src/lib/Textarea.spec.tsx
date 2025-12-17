import { render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';
import { describe, it, expect } from 'vitest';

describe('Textarea Primitive', () => {
  it('should render correctly', () => {
    render(<Textarea id="area" label="Describe" rows={3} />);
    expect(screen.getByLabelText('Describe')).toBeTruthy();
    const textArea = screen.getByLabelText('Describe') as HTMLTextAreaElement;
    expect(textArea.rows).toBe(3);
  });
});
