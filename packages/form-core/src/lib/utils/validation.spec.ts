import { buildValidationRules } from './validation';
import { describe, it, expect } from 'vitest';

describe('buildValidationRules', () => {
  it('should return empty rules if no validations provided', () => {
    const { rules, isRequired } = buildValidationRules(undefined);
    expect(rules).toEqual({});
    expect(isRequired).toBe(false);
  });

  it('should build required rule', () => {
    const { rules, isRequired } = buildValidationRules([
      { required: true, message: 'Required' },
    ]);
    expect(rules.required).toBe('Required');
    expect(isRequired).toBe(true);
  });

  it('should build pattern rule with regex', () => {
    const { rules } = buildValidationRules([
      { pattern: '^[0-9]+$', message: 'Numbers only' },
    ]);
    expect(rules.pattern).toEqual({
      value: /^[0-9]+$/,
      message: 'Numbers only',
    });
  });
});
