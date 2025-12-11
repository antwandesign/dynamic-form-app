import { TextFieldConfig } from '@zetta/types';
import { buildValidationRules, getNestedError } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface TextFieldProps {
  field: TextFieldConfig;
  path: string;
}

export const TextField: React.FC<TextFieldProps> = ({ field, path }) => {
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
      <input
        id={fieldPath}
        type={field.inputType || 'text'}
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`field-input ${error ? 'field-input-error' : ''}`}
        {...register(fieldPath, validationRules)}
      />
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
