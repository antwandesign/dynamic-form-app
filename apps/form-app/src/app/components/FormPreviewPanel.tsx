import { FormSchema, FormValues } from '@zetta/types';
import { FormBuilder } from '@zetta/ui';
import { getSavedFormData } from '@zetta/form-core';

const FORM_AUTOSAVE_KEY = 'custom-schema';

interface FormPreviewPanelProps {
  schema: FormSchema | null;
  hasErrors: boolean;
  jsonInput: string;
  onSubmit: (values: FormValues) => void;
}

export function FormPreviewPanel({
  schema,
  hasErrors,
  jsonInput,
  onSubmit,
}: FormPreviewPanelProps) {
  const showForm = !hasErrors && schema && schema.fields;

  return (
    <section className="panel form-panel">
      <h2>Preview</h2>
      <div className="form-preview-container">
        {showForm && (
          <FormBuilder
            key={jsonInput}
            schema={schema}
            onSubmit={onSubmit}
            schemaId={FORM_AUTOSAVE_KEY}
            initialValues={getSavedFormData(FORM_AUTOSAVE_KEY) || undefined}
          />
        )}
      </div>
    </section>
  );
}
