import { FieldConfig, GroupFieldConfig } from '@zetta/types';
import { useVisibility } from '@zetta/form-core';
import { TextField } from '../fields/TextField';
import { TextareaField } from '../fields/TextareaField';
import { DropdownField } from '../fields/DropdownField';
import { CheckboxField } from '../fields/CheckboxField';
import { RadioButtonField } from '../fields/RadioButtonField';
import { ValidatedTextField } from '../fields/ValidatedTextField';
import { ErrorField } from '../fields/ErrorField';
import { FieldGroup } from '../FieldGroup/FieldGroup';

interface FieldRendererProps {
  field: FieldConfig;
  path?: string;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  path = '',
}) => {
  const isVisible = useVisibility(field.visibility);

  if (!isVisible) {
    return null;
  }

  switch (field.type) {
    case 'text':
      return <TextField field={field} path={path} />;
    case 'textarea':
      return <TextareaField field={field} path={path} />;
    case 'dropdown':
      return <DropdownField field={field} path={path} />;
    case 'checkbox':
      return <CheckboxField field={field} path={path} />;
    case 'radio':
      return <RadioButtonField field={field} path={path} />;
    case 'validated-text':
      return <ValidatedTextField field={field} path={path} />;
    case 'group':
      return <FieldGroup group={field as GroupFieldConfig} path={path} />;
    default:
      return <ErrorField message="Unsupported field" />;
  }
};
