import { describe, it, expect } from 'vitest';
import {
  validateFormSchema,
  validateFormSchemaObject,
  validateFormValues,
  isPlainObject,
} from './schemaValidator';

describe('schemaValidator', () => {
  describe('validateFormSchema', () => {
    it('should validate a valid minimal schema', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [
          {
            id: 'name',
            label: 'Name',
            type: 'text',
          },
        ],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.schema).toBeDefined();
      expect(result.schema?.title).toBe('Test Form');
    });

    it('should reject invalid JSON', () => {
      const result = validateFormSchema('{ invalid json }');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid JSON');
    });

    it('should reject schema without title', () => {
      const json = JSON.stringify({
        fields: [{ id: 'name', label: 'Name', type: 'text' }],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('title'))).toBe(true);
    });

    it('should reject schema without fields', () => {
      const json = JSON.stringify({
        title: 'Test Form',
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('fields'))).toBe(true);
    });

    it('should reject field without id', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [{ label: 'Name', type: 'text' }],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('id'))).toBe(true);
    });

    it('should reject invalid field type', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [{ id: 'name', label: 'Name', type: 'invalid-type' }],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(false);
    });

    it('should validate nested group fields', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [
          {
            id: 'personal',
            label: 'Personal Info',
            type: 'group',
            fields: [
              { id: 'firstName', label: 'First Name', type: 'text' },
              { id: 'lastName', label: 'Last Name', type: 'text' },
            ],
          },
        ],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(true);
    });

    it('should validate dropdown with options', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [
          {
            id: 'country',
            label: 'Country',
            type: 'dropdown',
            options: [
              { label: 'USA', value: 'us' },
              { label: 'Canada', value: 'ca' },
            ],
          },
        ],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(true);
    });

    it('should validate field with visibility rules', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [
          {
            id: 'showMore',
            label: 'Show More',
            type: 'checkbox',
          },
          {
            id: 'moreInfo',
            label: 'More Info',
            type: 'text',
            visibility: {
              conditions: [
                { field: 'showMore', operator: 'equals', value: true },
              ],
            },
          },
        ],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(true);
    });

    it('should validate field with validations', () => {
      const json = JSON.stringify({
        title: 'Test Form',
        fields: [
          {
            id: 'email',
            label: 'Email',
            type: 'text',
            validations: [
              {
                pattern: '^[^@]+@[^@]+\\.[^@]+$',
                message: 'Invalid email format',
              },
            ],
          },
        ],
      });

      const result = validateFormSchema(json);

      expect(result.valid).toBe(true);
    });
  });

  describe('validateFormSchemaObject', () => {
    it('should validate a valid object', () => {
      const schema = {
        title: 'Test Form',
        fields: [{ id: 'name', label: 'Name', type: 'text' }],
      };

      const result = validateFormSchemaObject(schema);

      expect(result.valid).toBe(true);
    });

    it('should reject invalid object', () => {
      const result = validateFormSchemaObject({ foo: 'bar' });

      expect(result.valid).toBe(false);
    });
  });

  describe('validateFormValues', () => {
    it('should accept valid form values', () => {
      const values = {
        name: 'John',
        isActive: true,
        address: {
          city: 'New York',
          zip: '10001',
        },
      };

      expect(validateFormValues(values)).toBe(true);
    });

    it('should reject non-object values', () => {
      expect(validateFormValues('string')).toBe(false);
      expect(validateFormValues(123)).toBe(false);
      expect(validateFormValues(null)).toBe(false);
      expect(validateFormValues(undefined)).toBe(false);
      expect(validateFormValues([])).toBe(false);
    });

    it('should reject objects with invalid value types', () => {
      expect(validateFormValues({ count: 123 })).toBe(false);
      expect(validateFormValues({ items: ['a', 'b'] })).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ a: 1 })).toBe(true);
    });

    it('should return false for non-objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(123)).toBe(false);
    });
  });
});
