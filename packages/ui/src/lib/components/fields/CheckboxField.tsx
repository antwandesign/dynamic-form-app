import { CheckboxFieldConfig } from '@zetta/types';
import { buildValidationRules, getNestedError } from '@zetta/form-core';
import { useFormContext } from 'react-hook-form';

interface CheckboxFieldProps {
  field: CheckboxFieldConfig;
  path: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
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
    <div className="field-container field-container-checkbox">
      <label htmlFor={fieldPath} className="field-label-checkbox">
        <input
          id={fieldPath}
          type="checkbox"
          disabled={field.disabled}
          className="field-checkbox"
          {...register(fieldPath, validationRules)}
        />
        <span>{field.label}</span>
        {isRequired && <span className="required-indicator">*</span>}
      </label>
      {error && <span className="field-error">{error.message as string}</span>}
    </div>
  );
};
