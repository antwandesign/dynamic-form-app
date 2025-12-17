export { useVisibility } from './lib/hooks/useVisibility';
export { useDynamicValidation } from './lib/hooks/useDynamicValidation';
export { useApiIntegration } from './lib/hooks/useApiIntegration';
export {
  useAutoSave,
  getSavedFormData,
  clearSavedFormData,
} from './lib/hooks/useAutoSave';
export { buildValidationRules, getNestedError } from './lib/utils/validation';
export { filterHiddenFields } from './lib/utils/filterHiddenFields';
export {
  buildDefaultValues,
  mergeDefaultValues,
} from './lib/utils/buildDefaultValues';
export { logger } from './lib/utils/logger';
export { mockApiCall, VALID_ENDPOINTS } from './lib/services/mockApi';
export type { MockApiEndpoint } from './lib/services/mockApi';
export {
  validateFormSchema,
  validateFormSchemaObject,
  validateFormValues,
  isPlainObject,
} from './lib/utils/schemaValidator';
export type { SchemaValidationResult } from './lib/utils/schemaValidator';
