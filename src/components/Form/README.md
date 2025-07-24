# 📝 @PsySecGroup/forge-forms

A SolidJS form manager with built-in reactive state, validation hooks, and input synchronization. Easily manage form state, validation, and lifecycle in SolidJS apps.

---

## ⚡ Features

- Reactive form state for values, touched, and dirty flags
- Automatic input binding and event handling
- Supports `beforeSubmit` validation and `onError` handlers
- Async `onSubmit` and `afterSubmit` hooks
- Works with `input`, `select`, `textarea`
- Handles checkboxes, radio buttons, file inputs, multi-selects

---

## 📦 Installation

```bash
npm install @PsySecGroup/forge-forms
```

Or with pnpm:

```bash
pnpm add @PsySecGroup/forge-forms
```

---

## 🚀 Usage

### 1. Wrap your app (optional)

You can wrap your app with the provider if you want to share forms state globally (not required if you just use the `<Form />` component):

```tsx
import { FormsProvider } from '@PsySecGroup/forge-forms'

<FormsProvider>
  <App />
</FormsProvider>
```

### 2. Use the `<Form />` component

```tsx
import { Form } from '@PsySecGroup/forge-forms'

<Form
  id="contact"
  enctype="multipart/form-data"
  beforeSubmit={(data) => {
    // Return array of validation errors or cleaned data
    if (!data.email) {
      return [['email', 'Email is required']]
    }
    return data
  }}
  onSubmit={async (data) => {
    // Perform async submission
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return { success: true }
  }}
  afterSubmit={(response, formData) => {
    console.log('Submitted!', response, formData)
    // Reset or modify form state here if needed
    return formData
  }}
  onError={(errors, formData) => {
    console.error('Validation errors', errors)
  }}
>
  <input type="text" name="email" />
  <input type="checkbox" name="subscribe" />
  <button type="submit">Send</button>
</Form>
```

### 3. Access field metadata

To get reactive `value`, `touched`, and `dirty` states:

```tsx
import { getField } from '@PsySecGroup/forge-forms'

const emailMeta = getField('email')

console.log(emailMeta.value, emailMeta.touched, emailMeta.dirty)
```

---

## 🔍 API

### `<Form />` props

| Prop         | Type                                               | Description                                                    |
|--------------|----------------------------------------------------|----------------------------------------------------------------|
| `id`        | `string`                                         | Unique form identifier (required if no `name`)              |
| `name`      | `string`                                         | Alternative unique form name (required if no `id`)           |
| `enctype`   | `'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'` | Form encoding type (default `application/x-www-form-urlencoded`) |
| `beforeSubmit` | `(formData) => FormValues | ValidationErrors`         | Called before submit, can validate or transform data          |
| `onSubmit`  | `async (formData) => ResponseType`               | Called on submit with validated data                          |
| `afterSubmit` | `(response, formData) => FormValues`             | Called after submit completes, can reset or update form       |
| `onError`   | `(errors, formData) => void`                      | Called on validation or submission error                      |
| `children`  | `JSX.Element`                                    | Form input elements                                            |

### Helpers

- `getField(fieldName: string)`: returns `{ value, touched, dirty }` for a field inside the current form context

---

## 🧩 How it works

- On mount, the `<Form />` scans inputs inside itself with `name` attributes and registers default values
- Listens for `input`, `change`, and `blur` events to update form state reactively
- Extracts values intelligently (checkboxes, radios, files, multi-select)
- Supports async validation via `beforeSubmit`
- Tracks touched and dirty states per field for UI feedback

---

## ⌨️ Keyboard and Input Handling

- Input events update values immediately
- Blur events mark fields as touched
- Submit triggers validation and async submission pipeline
