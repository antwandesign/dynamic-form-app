# Zetta Dynamic Form Generator

A powerful, schema-driven form generation library built with React and TypeScript. Identify, validate, and render complex forms with ease using a JSON schema.

## Getting Started

To run the demo application locally:

```bash
npm run demo
```

This command will install dependencies, build the project, and start the development server.
Open **http://localhost:4200** in your browser to view the application.

## Schema Architecture

The core of the form generator is the `FormSchema` object. It defines the structure, behavior, and appearance of your form.

```typescript
interface FormSchema {
  title: string; // The title of the form
  description?: string; // Optional description displayed below the title
  fields: FieldConfig[]; // Array of field configurations
  apiIntegrations?: ApiIntegration[]; // Optional API configurations for dynamic data
}
```

## Field Types

The generator supports a variety of field types to cover most data collection needs. Each field shares a base configuration:

**Base Configuration:**

```json
{
  "id": "unique_field_id",
  "label": "User Friendly Label",
  "type": "field_type",
  "placeholder": "Optional placeholder text",
  "defaultValue": "Optional default value",
  "disabled": false, // Optional
  "visibility": { ... }, // Optional conditional logic
  "validations": [ ... ] // Optional validation rules
}
```

### 1. Text Field (`text`)

Used for single-line text input. Supports generic text, email, numbers, passwords, etc.

```json
{
  "id": "email",
  "type": "text",
  "label": "Email Address",
  "inputType": "email",
  "placeholder": "john@example.com",
  "validations": [
    {
      "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      "message": "Please enter a valid email"
    },
    {
      "required": true,
      "message": "Email is required"
    }
  ]
}
```

### 2. Textarea (`textarea`)

Used for multi-line text input.

```json
{
  "id": "bio",
  "type": "textarea",
  "label": "Biography",
  "rows": 4,
  "placeholder": "Tell us about yourself..."
}
```

### 3. Dropdown (`dropdown`)

Select one option from a list.

```json
{
  "id": "country",
  "type": "dropdown",
  "label": "Country",
  "options": [
    { "label": "United States", "value": "US" },
    { "label": "Canada", "value": "CA" },
    { "label": "United Kingdom", "value": "UK" }
  ]
}
```

### 4. Checkbox (`checkbox`)

A boolean toggle check box.

```json
{
  "id": "subscribe",
  "type": "checkbox",
  "label": "Subscribe to newsletter",
  "defaultValue": true
}
```

### 5. Radio Buttons (`radio`)

Select one option from a visible group.

```json
{
  "id": "theme",
  "type": "radio",
  "label": "Preferred Theme",
  "options": [
    { "label": "Light", "value": "light" },
    { "label": "Dark", "value": "dark" }
  ]
}
```

### 6. Validated Text (`validated-text`)

A text field that runs validation logic, potentially dependent on other fields.

```json
{
  "id": "username",
  "type": "validated-text",
  "label": "Username",
  "validations": [
    {
      "required": true,
      "message": "Username is required"
    },
    {
      "minLength": 3,
      "message": "Must be at least 3 characters"
    }
  ]
}
```

### 7. Group (`group`)

Used to visually group fields together. Can contain any other field types.

```json
{
  "id": "address_group",
  "type": "group",
  "label": "Shipping Address",
  "fields": [
    {
      "id": "street",
      "type": "text",
      "label": "Street"
    },
    {
      "id": "city",
      "type": "text",
      "label": "City"
    }
  ]
}
```

## Advanced Features

### Visibility Rules

Fields can be conditionally shown or hidden based on the values of other fields.

```json
{
  "id": "other_reason",
  "type": "text",
  "label": "Please specify",
  "visibility": {
    "conditions": [
      {
        "field": "reason_dropdown",
        "operator": "equals",
        "value": "other"
      }
    ]
  }
}
```

Supported operators: `equals`, `notEquals`, `contains`, `in`.

### Auto-Save

The form generator automatically saves user progress to `localStorage` to prevent data loss.

- **Storage Key**: `zetta-form-autosave-{schemaId}`
- **Behavior**:
  - Changes are saved automatically after a 300ms debounce.
  - Data persists even if the browser is closed or refreshed.
  - Saved data is automatically **cleared** upon successful form submission or when the form is reset.

### API Integration

Fetch dynamic data or options from remote endpoints.

```json
"apiIntegrations": [
  {
    "endpoint": "https://api.example.com/check-user",
    "sourceFields": ["email"],
    "targetFields": ["email_status"],
    "debounceMs": 500
  }
]
```

This configuration listens for changes in `sourceFields` (e.g., "email"), queries the `endpoint`, and can update `targetFields` based on the response.
