import { ValidatedTextFieldConfig } from '@zetta/types';
import { getNestedError, useDynamicValidation } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface ValidatedTextFieldProps {
  field: ValidatedTextFieldConfig;
  path: string;
}

export const ValidatedTextField: React.FC<ValidatedTextFieldProps> = ({
  field,
  path,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldPath = path ? `${path}.${field.id}` : field.id;
  const error = getNestedError(errors, fieldPath);

  const validationRules = useDynamicValidation(
    field.validations || [],
    field.dynamicValidation
  );

  const isRequired = !!validationRules.required;

  return (
    <div className="field-container">
      <label htmlFor={fieldPath} className="field-label">
        {field.label}
        {isRequired && <span className="required-indicator">*</span>}
      </label>
      <input
        id={fieldPath}
        type="text"
        placeholder={field.placeholder}
        disabled={field.disabled}
        className={`field-input ${error ? 'field-input-error' : ''}`}
        {...register(fieldPath, validationRules)}
      />
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
