import { GroupFieldConfig } from '@zetta/types';
import { FieldRenderer } from '../FieldRenderer/FieldRenderer';

interface FieldGroupProps {
  group: GroupFieldConfig;
  path?: string;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({ group, path = '' }) => {
  const groupPath = path ? `${path}.${group.id}` : group.id;

  return (
    <div className="field-group">
      <div className="field-group-header">
        <h3 className="field-group-title">{group.label}</h3>
        {group.description && (
          <p className="field-group-description">{group.description}</p>
        )}
      </div>
      <div className="field-group-content">
        {group.fields.map((field) => (
          <FieldRenderer key={field.id} field={field} path={groupPath} />
        ))}
      </div>
    </div>
  );
};
