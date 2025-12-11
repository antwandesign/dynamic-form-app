import { useFormContext, useWatch } from 'react-hook-form';
import { useMemo } from 'react';
import { ValidationRule } from '@zetta/types';

interface DynamicValidationConfig {
  dependsOn: string;
  rules: Record<string, { pattern: string; message: string }>;
}

function safeRegExp(pattern: string): RegExp | null {
  try {
    return new RegExp(pattern);
  } catch {
    return null;
  }
}

export function useDynamicValidation(
  staticValidations: ValidationRule[] = [],
  dynamicValidation?: DynamicValidationConfig
) {
  const { control } = useFormContext();

  const conditionalFields = useMemo(() => {
    const fields: string[] = [];
    for (const rule of staticValidations) {
      if (rule.when?.field && !fields.includes(rule.when.field)) {
        fields.push(rule.when.field);
      }
    }
    if (dynamicValidation?.dependsOn) {
      fields.push(dynamicValidation.dependsOn);
    }
    return fields;
  }, [staticValidations, dynamicValidation?.dependsOn]);

  const watchedValues = useWatch({
    control,
    name: conditionalFields,
  });

  const fieldValues = useMemo(() => {
    const map: Record<string, unknown> = {};
    conditionalFields.forEach((field, index) => {
      map[field] = watchedValues[index];
    });
    return map;
  }, [conditionalFields, watchedValues]);

  const validationRules = useMemo(() => {
    const rules: Record<string, unknown> = {};

    for (const rule of staticValidations) {
      if (rule.when) {
        const watchedValue = fieldValues[rule.when.field];
        if (watchedValue !== rule.when.equals) {
          continue;
        }
      }

      if (rule.required) {
        rules.required = rule.message || 'This field is required';
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

    if (dynamicValidation) {
      const dependentValue = fieldValues[dynamicValidation.dependsOn];
      if (dependentValue && typeof dependentValue === 'string') {
        const dynamicRule = dynamicValidation.rules[dependentValue];
        if (dynamicRule) {
          const regex = safeRegExp(dynamicRule.pattern);
          if (regex) {
            rules.pattern = {
              value: regex,
              message: dynamicRule.message,
            };
          }
        }
      }
    }

    return rules;
  }, [staticValidations, dynamicValidation, fieldValues]);

  return validationRules;
}
