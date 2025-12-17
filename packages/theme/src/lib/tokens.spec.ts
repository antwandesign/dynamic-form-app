import { colors, spacing } from './tokens';
import { describe, it, expect } from 'vitest';

describe('Theme Tokens', () => {
  it('should have defined colors', () => {
    expect(colors).toBeDefined();
    expect(colors.primary).toBeDefined();
  });

  it('should have defined spacing', () => {
    expect(spacing).toBeDefined();
  });
});
