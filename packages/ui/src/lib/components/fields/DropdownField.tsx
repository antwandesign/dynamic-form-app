import { DropdownFieldConfig } from '@zetta/types';
import { buildValidationRules, getNestedError } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface DropdownFieldProps {
  field: DropdownFieldConfig;
  path: string;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
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
      <select
        id={fieldPath}
        disabled={field.disabled}
        className={`field-select ${error ? 'field-input-error' : ''}`}
        {...register(fieldPath, validationRules)}
      >
        <option value="" disabled>
          {field.placeholder || 'Select an option...'}
        </option>
        {field.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
