import Ajv from 'ajv';
import { FormSchema, FieldConfig, FieldType } from '@zetta/types';

const MAX_SCHEMA_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_NESTING_DEPTH = 10;

const ajv = new Ajv({ allErrors: true, strict: false });
const fieldOptionSchema = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    value: { type: 'string' },
  },
  required: ['label', 'value'],
  additionalProperties: false,
} as const;

const visibilityConditionSchema = {
  type: 'object',
  properties: {
    field: { type: 'string' },
    operator: {
      type: 'string',
      enum: ['equals', 'notEquals', 'contains', 'in'],
    },
    value: {
      oneOf: [
        { type: 'string' },
        { type: 'boolean' },
        { type: 'array', items: { type: 'string' } },
      ],
    },
  },
  required: ['field', 'operator', 'value'],
  additionalProperties: false,
} as const;

const validationRuleSchema = {
  type: 'object',
  properties: {
    when: {
      type: 'object',
      properties: {
        field: { type: 'string' },
        equals: {
          oneOf: [{ type: 'string' }, { type: 'boolean' }],
        },
      },
      required: ['field', 'equals'],
    },
    pattern: { type: 'string' },
    message: { type: 'string' },
    minLength: { type: 'number' },
    maxLength: { type: 'number' },
    required: { type: 'boolean' },
  },
  required: ['message'],
  additionalProperties: false,
} as const;

const apiIntegrationSchema = {
  type: 'object',
  properties: {
    endpoint: { type: 'string' },
    sourceFields: { type: 'array', items: { type: 'string' } },
    targetFields: { type: 'array', items: { type: 'string' } },
    debounceMs: { type: 'number' },
  },
  required: ['endpoint', 'sourceFields', 'targetFields'],
  additionalProperties: false,
} as const;

const VALID_FIELD_TYPES: FieldType[] = [
  'text',
  'textarea',
  'dropdown',
  'checkbox',
  'radio',
  'validated-text',
  'group',
];

const fieldConfigSchema: Record<string, unknown> = {
  type: 'object',
  properties: {
    id: { type: 'string', minLength: 1 },
    label: { type: 'string' },
    type: { type: 'string', enum: VALID_FIELD_TYPES },
    placeholder: { type: 'string' },
    defaultValue: {
      oneOf: [{ type: 'string' }, { type: 'boolean' }],
    },
    disabled: { type: 'boolean' },
    visibility: {
      type: 'object',
      properties: {
        conditions: {
          type: 'array',
          items: visibilityConditionSchema,
        },
      },
      required: ['conditions'],
    },
    validations: {
      type: 'array',
      items: validationRuleSchema,
    },
    apiIntegration: apiIntegrationSchema,
    inputType: {
      type: 'string',
      enum: ['text', 'password', 'email', 'tel', 'url', 'number'],
    },
    rows: { type: 'number' },
    options: {
      type: 'array',
      items: fieldOptionSchema,
    },
    description: { type: 'string' },
    fields: {
      type: 'array',
      items: { $ref: '#/$defs/fieldConfig' },
    },
    dynamicValidation: {
      type: 'object',
      properties: {
        dependsOn: { type: 'string' },
        rules: { type: 'object' },
      },
      required: ['dependsOn', 'rules'],
    },
  },
  required: ['id', 'label', 'type'],
  additionalProperties: false,
};

const formSchemaValidator = ajv.compile({
  type: 'object',
  $defs: {
    fieldConfig: fieldConfigSchema,
  },
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    fields: {
      type: 'array',
      items: { $ref: '#/$defs/fieldConfig' },
    },
    apiIntegrations: {
      type: 'array',
      items: apiIntegrationSchema,
    },
  },
  required: ['title', 'fields'],
  additionalProperties: false,
});

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  schema?: FormSchema;
}

function validateNestingDepth(
  fields: FieldConfig[],
  currentDepth = 0
): boolean {
  if (currentDepth > MAX_NESTING_DEPTH) {
    return false;
  }

  for (const field of fields) {
    if (field.type === 'group' && field.fields) {
      if (!validateNestingDepth(field.fields, currentDepth + 1)) {
        return false;
      }
    }
  }

  return true;
}

export function validateFormSchema(jsonString: string): SchemaValidationResult {
  const byteSize = new Blob([jsonString]).size;
  if (byteSize > MAX_SCHEMA_SIZE_BYTES) {
    return {
      valid: false,
      errors: [
        `Schema exceeds maximum size of ${
          MAX_SCHEMA_SIZE_BYTES / 1024 / 1024
        }MB`,
      ],
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    return {
      valid: false,
      errors: [`Invalid JSON: ${(err as Error).message}`],
    };
  }

  const isValid = formSchemaValidator(parsed);
  if (!isValid && formSchemaValidator.errors) {
    const schemaErrors = formSchemaValidator.errors.map((err) => {
      const path = err.instancePath || '/';
      return `${path}: ${err.message}`;
    });
    return {
      valid: false,
      errors: schemaErrors,
    };
  }

  const schema = parsed as FormSchema;

  if (!validateNestingDepth(schema.fields)) {
    return {
      valid: false,
      errors: [
        `Groups nested too deeply. Maximum depth is ${MAX_NESTING_DEPTH}`,
      ],
    };
  }

  return {
    valid: true,
    errors: [],
    schema,
  };
}

export function validateFormSchemaObject(
  data: unknown
): SchemaValidationResult {
  const isValid = formSchemaValidator(data);
  if (!isValid && formSchemaValidator.errors) {
    const schemaErrors = formSchemaValidator.errors.map((err) => {
      const path = err.instancePath || '/';
      return `${path}: ${err.message}`;
    });
    return {
      valid: false,
      errors: schemaErrors,
    };
  }

  const schema = data as FormSchema;

  if (!validateNestingDepth(schema.fields)) {
    return {
      valid: false,
      errors: [
        `Groups nested too deeply. Maximum depth is ${MAX_NESTING_DEPTH}`,
      ],
    };
  }

  return {
    valid: true,
    errors: [],
    schema,
  };
}

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateFormValues(data: unknown): boolean {
  if (!isPlainObject(data)) {
    return false;
  }

  for (const value of Object.values(data)) {
    if (typeof value === 'string' || typeof value === 'boolean') {
      continue;
    }
    if (isPlainObject(value)) {
      if (!validateFormValues(value)) {
        return false;
      }
      continue;
    }

    return false;
  }

  return true;
}
