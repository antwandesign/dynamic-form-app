interface SchemaEditorPanelProps {
  jsonInput: string;
  hasErrors: boolean;
  parseError: string | null;
  validationErrors: string[];
  onJsonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function SchemaEditorPanel({
  jsonInput,
  hasErrors,
  parseError,
  validationErrors,
  onJsonChange,
}: SchemaEditorPanelProps) {
  return (
    <section className="panel json-panel">
      <h2>JSON Schema</h2>
      <div className="json-input-container">
        <textarea
          className={`json-input ${hasErrors ? 'json-input-error' : ''}`}
          value={jsonInput}
          onChange={onJsonChange}
          spellCheck={false}
          placeholder='Enter your JSON schema here, e.g. {"title": "My Form", "fields": []}'
        />
        {parseError && (
          <div className="json-error">
            <strong>Parse Error:</strong> {parseError}
          </div>
        )}
        {validationErrors.length > 0 && (
          <div className="json-error">
            <strong>Validation Errors:</strong>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
