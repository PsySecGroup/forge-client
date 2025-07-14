import { useContext } from 'solid-js'
import { JSX, ParentProps } from 'solid-js'
import { FormsStore, FormsContext, getFormsActions } from '../../core/state/formStore'

type Props = {
  name: string
  onSubmit: (formData: Record<string, any>) => void
} & ParentProps

/**
 * 
 */
export function Form({ name, onSubmit, children }: Props): JSX.Element {
  const [ state ] = FormsStore
  const { initializeForm } = getFormsActions()

  // Ensure the form exists in the store
  initializeForm(name)

  function handleSubmit(e: Event) {
    e.preventDefault()
    onSubmit(state.forms[name] ?? {})
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormsContext.Provider value={name}>
        {children}
      </FormsContext.Provider>
    </form>
  )
}

/**
 * 
 */
export function extractInputValue(target: EventTarget | null): any {
  if (!(target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target instanceof HTMLSelectElement)) {
    return undefined
  }

  const { type, value, checked, files, multiple } = target as HTMLInputElement

  switch (type) {
    case 'checkbox':
      if (target instanceof HTMLInputElement) {
        // Multiple checkboxes with the same name?
        if (target.name && document) {
          const checkboxes = document.querySelectorAll(`input[name="${target.name}"][type="checkbox"]`) as NodeListOf<HTMLInputElement>
          const checkedValues = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value)
          return checkedValues.length > 1 ? checkedValues : checked // could return array or single boolean
        }
        return checked
      }
      return checked

    case 'radio':
      return checked ? value : undefined

    case 'file':
      return multiple ? files : files?.[0] ?? null

    default:
      return value
  }
}

/**
 * 
 */
export function setField(fieldName: string) {
  const formName = useContext(FormsContext)
  const { updateField, markTouched } = getFormsActions()

  if (!formName) {
    throw new Error('useFormField must be used within a <Form> component')
  }

  return {
    onInput: (e: Event) => {
      const value = extractInputValue(e.target)
      updateField(formName, fieldName, value)
    },

    onChange: (e: Event) => {
      const value = extractInputValue(e.target)
      updateField(formName, fieldName, value)
    },

    onBlur: () => {
      markTouched(formName, fieldName)
    }
  }
}

export function getField(fieldName: string) {
  const formName = useContext(FormsContext)

  if (!formName) {
    throw new Error(`useFormFieldMeta must be used within a <Form> component named ${formName}`)
  }

  const [state] = FormsStore
  const form = state.forms[formName]

    if (form === undefined) {
      throw new RangeError(`"${formName}" is not a defined form.`)
    }

    return {
      value: form.values?.[fieldName],
      touched: form.touched?.[fieldName] || false,
      dirty: form.dirty?.[fieldName] || false
    }
  }