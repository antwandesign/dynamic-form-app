import { useForm, FormProvider } from 'react-hook-form';
import { FormSchema, FormValues } from '@zetta/types';
import {
  filterHiddenFields,
  clearSavedFormData,
  buildDefaultValues,
} from '@zetta/form-core';
import { FieldRenderer } from '../FieldRenderer/FieldRenderer';
import { ApiIntegrationHandler } from './ApiIntegrationHandler';
import { useMemo } from 'react';

interface FormBuilderProps {
  schema: FormSchema;
  onSubmit: (values: FormValues) => void;
  initialValues?: FormValues;
  schemaId?: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  onSubmit,
  initialValues = {},
  schemaId,
}) => {
  // Extract default values from schema and merge with any saved/initial values
  const computedDefaultValues = useMemo(() => {
    const schemaDefaults = buildDefaultValues(schema.fields);
    return { ...schemaDefaults, ...initialValues };
  }, [schema.fields, initialValues]);

  const methods = useForm({
    defaultValues: computedDefaultValues,
    mode: 'onBlur',
  });

  const handleSubmit = methods.handleSubmit((data) => {
    const filteredData = filterHiddenFields(schema.fields, data as FormValues);

    if (schemaId) {
      clearSavedFormData(schemaId);
    }
    onSubmit(filteredData);
  });

  return (
    <FormProvider {...methods}>
      {schema.apiIntegrations?.map((integration) => (
        <ApiIntegrationHandler
          key={`${integration.endpoint}-${integration.sourceFields.join(',')}`}
          integration={integration}
        />
      ))}

      <form onSubmit={handleSubmit} className="form-builder">
        <div className="form-header">
          <h2 className="form-title">{schema.title}</h2>
          {schema.description && (
            <p className="form-description">{schema.description}</p>
          )}
        </div>

        <div className="form-fields">
          {schema.fields.map((field) => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="form-submit-button">
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
