import React, { forwardRef } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`field-container ${className}`}>
        <label htmlFor={inputId} className="field-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`field-input ${error ? 'field-input-error' : ''}`}
          {...props}
        />
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
