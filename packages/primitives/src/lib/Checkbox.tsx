import React, { forwardRef } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, required, id, className = '', ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`field-container field-container-checkbox ${className}`}>
        <label htmlFor={checkboxId} className="field-label-checkbox">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className="field-checkbox"
            {...props}
          />
          <span>{label}</span>
          {required && <span className="required-indicator">*</span>}
        </label>
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
