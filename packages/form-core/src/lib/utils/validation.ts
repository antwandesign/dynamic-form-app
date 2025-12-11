import { ValidationRule } from '@zetta/types';

function safeRegExp(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}

export function buildValidationRules(validations?: ValidationRule[]) {
  const rules: Record<string, unknown> = {};
  let isRequired = false;

  if (validations) {
    for (const rule of validations) {
      if (rule.required) {
        rules.required = rule.message || 'This field is required';
        isRequired = true;
      }
      if (rule.minLength) {
        rules.minLength = { value: rule.minLength, message: rule.message };
      }
      if (rule.maxLength) {
        rules.maxLength = { value: rule.maxLength, message: rule.message };
      }
      if (rule.pattern) {
        const regex = safeRegExp(rule.pattern);
        if (regex) {
          rules.pattern = {
            value: regex,
            message: rule.message,
          };
        }
      }
    }
  }

  return { rules, isRequired };
}

export function getNestedError(
  errors: Record<string, unknown>,
  path: string
): { message?: string } | undefined {
  const parts = path.split('.');
  let current: unknown = errors;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current as { message?: string } | undefined;
}
