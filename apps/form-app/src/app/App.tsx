import { useState, useCallback, useEffect } from 'react';
import { FormSchema, FormValues } from '@zetta/types';
import { FormBuilder } from '@zetta/ui';
import { getSavedFormData } from '@zetta/form-core';
import './app.css';
import { SCHEMA_OPTIONS } from '../schemas/schemas';

const SCHEMA_STORAGE_KEY = 'zetta-schema-input';
const FORM_AUTOSAVE_KEY = 'custom-schema';

function App() {
  const [jsonInput, setJsonInput] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(SCHEMA_STORAGE_KEY);
      return saved || '{}';
    } catch {
      return '{}';
    }
  });
  const [schema, setSchema] = useState<FormSchema | null>(() => {
    try {
      const saved = localStorage.getItem(SCHEMA_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as FormSchema;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  });
  const [parseError, setParseError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(SCHEMA_STORAGE_KEY, jsonInput);
      } catch (error) {
        console.warn('Failed to save schema to localStorage:', error);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [jsonInput]);

  const handleSchemaSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const schemaId = e.target.value;
      const selectedOption = SCHEMA_OPTIONS.find((opt) => opt.id === schemaId);

      if (selectedOption) {
        const schemaJson = JSON.stringify(selectedOption.schema, null, 2);
        setJsonInput(schemaJson);
        setSchema(selectedOption.schema as FormSchema);
        setParseError(null);
        setSubmittedData(null);
      }
    },
    []
  );

  const handleJsonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setJsonInput(value);

      try {
        const parsed = JSON.parse(value) as FormSchema;
        setSchema(parsed);
        setParseError(null);
      } catch (err) {
        setParseError((err as Error).message);
      }
    },
    []
  );

  const handleSubmit = useCallback((values: FormValues) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Form submitted:', values);
    }
    setSubmittedData(values);
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Zetta Dynamic Form Generator</h1>

        <div className="schema-selector">
          <label htmlFor="schema-select">Import:</label>
          <select
            id="schema-select"
            defaultValue=""
            onChange={handleSchemaSelect}
            className="schema-dropdown"
          >
            <option value="" disabled>
              Select a schema...
            </option>
            {SCHEMA_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="app-content">
        <section className="panel json-panel">
          <h2>JSON Schema</h2>
          <div className="json-input-container">
            <textarea
              className={`json-input ${parseError ? 'json-input-error' : ''}`}
              value={jsonInput}
              onChange={handleJsonChange}
              spellCheck={false}
              placeholder='Enter your JSON schema here, e.g. {"title": "My Form", "fields": []}'
            />
            {parseError && (
              <div className="json-error">
                <strong>Parse Error:</strong> {parseError}
              </div>
            )}
          </div>
        </section>

        <section className="panel form-panel">
          <h2>Preview</h2>
          <div className="form-preview-container">
            {!parseError && schema && schema.fields && (
              <FormBuilder
                key={jsonInput}
                schema={schema}
                onSubmit={handleSubmit}
                schemaId={FORM_AUTOSAVE_KEY}
                initialValues={getSavedFormData(FORM_AUTOSAVE_KEY) || undefined}
              />
            )}
          </div>
        </section>

        <section className="panel output-panel">
          <h2>Result</h2>
          <div className="output-container">
            {submittedData ? (
              <pre className="output-json">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            ) : (
              <p className="output-placeholder">
                Submit the form to see the JSON output here
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
