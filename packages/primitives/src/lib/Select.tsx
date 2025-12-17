import React, { forwardRef } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      required,
      id,
      className = '',
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`field-container ${className}`}>
        <label htmlFor={selectId} className="field-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`field-select ${error ? 'field-input-error' : ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
