import { RadioFieldConfig } from '@zetta/types';
import { buildValidationRules, getNestedError } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface RadioButtonFieldProps {
  field: RadioFieldConfig;
  path: string;
}

export const RadioButtonField: React.FC<RadioButtonFieldProps> = ({
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
      <fieldset className="field-fieldset">
        <legend className="field-label">
          {field.label}
          {isRequired && <span className="required-indicator">*</span>}
        </legend>
        <div className="field-radio-group">
          {field.options.map((option) => (
            <label key={option.value} className="field-radio-label">
              <input
                type="radio"
                value={option.value}
                disabled={field.disabled}
                className="field-radio"
                {...register(fieldPath, validationRules)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
