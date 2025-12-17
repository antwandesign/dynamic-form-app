import { useState, useCallback } from 'react';
import { FormValues } from '@zetta/types';
import { useSchemaEditor } from './hooks/useSchemaEditor';
import {
  AppHeader,
  SchemaEditorPanel,
  FormPreviewPanel,
  OutputPanel,
} from './components';
import './app.css';

function App() {
  const {
    jsonInput,
    schema,
    parseError,
    validationErrors,
    hasErrors,
    handleJsonChange,
    handleSchemaSelect,
  } = useSchemaEditor();

  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);

  const handleSubmit = useCallback((values: FormValues) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Form submitted:', values);
    }
    setSubmittedData(values);
  }, []);

  return (
    <div className="app-container">
      <AppHeader onSchemaSelect={handleSchemaSelect} />

      <div className="app-content">
        <SchemaEditorPanel
          jsonInput={jsonInput}
          hasErrors={hasErrors}
          parseError={parseError}
          validationErrors={validationErrors}
          onJsonChange={handleJsonChange}
        />

        <FormPreviewPanel
          schema={schema}
          hasErrors={hasErrors}
          jsonInput={jsonInput}
          onSubmit={handleSubmit}
        />

        <OutputPanel submittedData={submittedData} />
      </div>
    </div>
  );
}

export default App;
