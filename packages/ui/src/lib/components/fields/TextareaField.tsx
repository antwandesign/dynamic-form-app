import { TextareaFieldConfig } from '@zetta/types';
import { buildValidationRules, getNestedError } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface TextareaFieldProps {
  field: TextareaFieldConfig;
  path: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  path,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldPath = path ? `${path}.${field.id}` : field.id;
  const error = getNestedError(errors, fieldPath);
  const { rules: validationRules, isRequired } = buildValidationRules(
    field.validations
  );

  return (
    <div className="field-container">
      <label htmlFor={fieldPath} className="field-label">
        {field.label}
        {isRequired && <span className="required-indicator">*</span>}
      </label>
      <textarea
        id={fieldPath}
        placeholder={field.placeholder}
        disabled={field.disabled}
        rows={field.rows || 4}
        className={`field-textarea ${error ? 'field-input-error' : ''}`}
        {...register(fieldPath, validationRules)}
      />
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
