import { FieldType } from './types';
import { describe, it, expect } from 'vitest';

describe('Types Package', () => {
  it('should export FieldType type', () => {
    // This is a type check basically, if it compiles it passes.
    // We can just assert something trivial.
    const type: FieldType = 'text';
    expect(type).toBe('text');
  });
});
