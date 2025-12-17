import { SCHEMA_OPTIONS, SchemaOption } from '../../schemas/schemas';

interface AppHeaderProps {
  onSchemaSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function AppHeader({ onSchemaSelect }: AppHeaderProps) {
  return (
    <header className="app-header">
      <h1>Zetta Dynamic Form Generator</h1>

      <div className="schema-selector">
        <label htmlFor="schema-select">Import:</label>
        <select
          id="schema-select"
          defaultValue=""
          onChange={onSchemaSelect}
          className="schema-dropdown"
        >
          <option value="" disabled>
            Select a schema...
          </option>
          {SCHEMA_OPTIONS.map((option: SchemaOption) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
