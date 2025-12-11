import { useFormContext, useWatch } from 'react-hook-form';
import { VisibilityRule } from '@zetta/types';

export function useVisibility(visibility?: VisibilityRule): boolean {
  const { control } = useFormContext();
  const fieldNames = visibility?.conditions.map((c) => c.field) || [];

  const values = useWatch({
    control,
    name: fieldNames,
  });

  if (!visibility || visibility.conditions.length === 0) {
    return true;
  }

  return visibility.conditions.every((condition, index) => {
    const fieldValue = values[index];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        if (
          typeof fieldValue === 'string' &&
          typeof condition.value === 'string'
        ) {
          return fieldValue.includes(condition.value);
        }
        return false;
      case 'in':
        if (Array.isArray(condition.value)) {
          return condition.value.includes(fieldValue as string);
        }
        return false;
      default:
        return true;
    }
  });
}
