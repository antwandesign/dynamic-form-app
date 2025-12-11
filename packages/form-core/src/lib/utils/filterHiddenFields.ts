import { FieldConfig, VisibilityRule, FormValues } from '@zetta/types';

function isFieldVisible(
  visibility: VisibilityRule | undefined,
  allValues: FormValues
): boolean {
  if (
    !visibility ||
    !visibility.conditions ||
    visibility.conditions.length === 0
  ) {
    return true;
  }

  return visibility.conditions.every((condition) => {
    const fieldValue = getValueByPath(allValues, condition.field);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        return (
          typeof fieldValue === 'string' &&
          fieldValue.includes(condition.value as string)
        );
      case 'in':
        if (Array.isArray(condition.value)) {
          return condition.value.some((v) => v === fieldValue);
        }
        return false;
      default:
        return true;
    }
  });
}

function getValueByPath(obj: FormValues, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return current;
}

export function filterHiddenFields(
  fields: FieldConfig[],
  values: FormValues,
  path = ''
): FormValues {
  const result: FormValues = {};

  for (const field of fields) {
    const fieldPath = path ? `${path}.${field.id}` : field.id;

    if (!isFieldVisible(field.visibility, values)) {
      continue;
    }

    if (field.type === 'group' && 'fields' in field) {
      const groupValue = getValueByPath(values, fieldPath);
      if (groupValue && typeof groupValue === 'object') {
        const filteredGroup = filterHiddenFields(
          field.fields,
          values,
          fieldPath
        );
        if (Object.keys(filteredGroup).length > 0) {
          result[field.id] = filteredGroup;
        }
      }
    } else {
      const value = getValueByPath(values, fieldPath);
      if (value !== undefined) {
        result[field.id] = value as FormValues[keyof FormValues];
      }
    }
  }

  return result;
}
