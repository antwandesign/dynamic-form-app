import React, { forwardRef } from 'react';

export interface RadioOption {
  label: string;
  value: string;
}

export interface RadioGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  options: RadioOption[];
  error?: string;
  required?: boolean;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    { label, options, error, required, name, className = '', ...props },
    ref
  ) => {
    const groupName =
      name || `radio-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`field-container ${className}`}>
        <fieldset className="field-fieldset">
          <legend className="field-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </legend>
          <div className="field-radio-group">
            {options.map((option, index) => (
              <label key={option.value} className="field-radio-label">
                <input
                  ref={index === 0 ? ref : undefined}
                  type="radio"
                  name={groupName}
                  value={option.value}
                  className="field-radio"
                  {...props}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
