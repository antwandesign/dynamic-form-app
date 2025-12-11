import { FieldConfig, FormValues, GroupFieldConfig } from '@zetta/types';

/**
 * Recursively extracts default values from field configurations.
 * This is needed because react-hook-form requires default values to be
 * passed to useForm(), not as defaultValue props on individual inputs.
 */
export function buildDefaultValues(
  fields: FieldConfig[],
  path = ''
): FormValues {
  const values: FormValues = {};

  for (const field of fields) {
    if (field.type === 'group') {
      const groupField = field as GroupFieldConfig;
      const groupValues = buildDefaultValues(groupField.fields, field.id);
      if (Object.keys(groupValues).length > 0) {
        values[field.id] = groupValues;
      }
    } else if ('defaultValue' in field && field.defaultValue !== undefined) {
      values[field.id] = field.defaultValue;
    }
  }

  return values;
}

/**
 * Merges default values from schema with any saved/initial values.
 * Saved values take precedence over schema defaults.
 */
export function mergeDefaultValues(
  schemaDefaults: FormValues,
  savedValues?: FormValues
): FormValues {
  if (!savedValues) {
    return schemaDefaults;
  }

  // Saved values override schema defaults
  return { ...schemaDefaults, ...savedValues };
}
