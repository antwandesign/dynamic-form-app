import React, { forwardRef } from 'react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}


export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, id, className = '', rows = 4, ...props }, ref) => {
    const textareaId =
      id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`field-container ${className}`}>
        <label htmlFor={textareaId} className="field-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`field-textarea ${error ? 'field-input-error' : ''}`}
          {...props}
        />
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
