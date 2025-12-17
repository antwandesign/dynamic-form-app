export type FieldType =
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'radio'
  | 'validated-text'
  | 'group';

export type ComparisonOperator = 'equals' | 'notEquals' | 'contains' | 'in';

export interface VisibilityCondition {
  field: string;

  operator: ComparisonOperator;

  value: string | string[] | boolean;
}

export interface VisibilityRule {
  conditions: VisibilityCondition[];
}

export interface ValidationRule {
  when?: {
    field: string;
    equals: string | boolean;
  };

  pattern?: string;

  message: string;

  minLength?: number;

  maxLength?: number;

  required?: boolean;
}

export interface ApiIntegration {
  endpoint: string;

  sourceFields: string[];

  targetFields: string[];

  debounceMs?: number;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface BaseFieldConfig {
  id: string;

  label: string;

  type: FieldType;

  placeholder?: string;

  defaultValue?: string | boolean;

  disabled?: boolean;

  visibility?: VisibilityRule;

  validations?: ValidationRule[];

  apiIntegration?: ApiIntegration;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text';

  inputType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'number';
}

export interface TextareaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  rows?: number;
}

export interface DropdownFieldConfig
  extends Omit<BaseFieldConfig, 'defaultValue'> {
  type: 'dropdown';
  options: FieldOption[];
  defaultValue?: string;
}

export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: 'checkbox';
  defaultValue?: boolean;
}

export interface RadioFieldConfig extends BaseFieldConfig {
  type: 'radio';
  options: FieldOption[];
}

export interface ValidatedTextFieldConfig extends BaseFieldConfig {
  type: 'validated-text';

  dynamicValidation?: {
    dependsOn: string;
    rules: Record<string, { pattern: string; message: string }>;
  };
}

export interface GroupFieldConfig
  extends Omit<
    BaseFieldConfig,
    'placeholder' | 'defaultValue' | 'validations'
  > {
  type: 'group';

  description?: string;

  fields: FieldConfig[];
}

export type FieldConfig =
  | TextFieldConfig
  | TextareaFieldConfig
  | DropdownFieldConfig
  | CheckboxFieldConfig
  | RadioFieldConfig
  | ValidatedTextFieldConfig
  | GroupFieldConfig;

export interface FormSchema {
  title: string;

  description?: string;

  fields: FieldConfig[];

  apiIntegrations?: ApiIntegration[];
}

export interface FormValues {
  [key: string]: string | boolean | FormValues;
}

export interface FormBuilderProps {
  schema: FormSchema;

  onSubmit: (values: FormValues) => void;

  initialValues?: FormValues;
}

export interface FieldRendererProps {
  field: FieldConfig;
  path?: string;
}

export interface FieldGroupProps {
  group: GroupFieldConfig;
  path?: string;
}
