import { onCleanup, onMount, useContext } from 'solid-js'
import { JSX, ParentProps } from 'solid-js'
import { FormsStore, FormsContext, getFormsActions } from '../../core/state/formStore'

type HTMLFormEncType =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'

type Props = {
  id?: string
  name?: string
  enctype?: HTMLFormEncType
  onSubmit: (formData: Record<string, any>) => void
} & ParentProps

/**
 * 
 */
export function Form({
  id,
  name,
  enctype = 'application/x-www-form-urlencoded',
  onSubmit,
  children
}: Props): JSX.Element {
  const [ state ] = FormsStore
  const { initializeForm } = getFormsActions()

  // Ensure the form exists in the store
  const formName = id ?? name

  if (!formName) {
    throw new RangeError("A form must have either an id or a name")
  }

  //initializeForm(formName)
  let formRef: HTMLFormElement | undefined

  onMount(() => {
    const inputs = formRef?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input[name], select[name], textarea[name]'
    )

    const defaultValues: Record<string, any> = {}

    inputs?.forEach((input) => {
      const name = input.name
      if (!name) return

      const { onInput, onChange, onBlur } = setField(formName, name)
      input.addEventListener('input', onInput)
      input.addEventListener('change', onChange)
      input.addEventListener('blur', onBlur)

      onCleanup(() => {
        input.removeEventListener('input', onInput)
        input.removeEventListener('change', onChange)
        input.removeEventListener('blur', onBlur)
      })

      if (input instanceof HTMLInputElement) {
        switch (input.type) {
          case 'checkbox':
            defaultValues[name] = input.checked
            break
          case 'radio':
            if (input.checked) defaultValues[name] = input.value
            break
          case 'file':
            // Skip file inputs — user must explicitly populate
            break
          default:
            defaultValues[name] = input.value
        }
      } else if (input instanceof HTMLSelectElement && input.multiple) {
        defaultValues[name] = Array.from(input.selectedOptions).map(opt => opt.value)
      } else {
        defaultValues[name] = input.value
      }
    })

    initializeForm(formName, defaultValues)
  })

  function handleSubmit(e: Event) {
    e.preventDefault()
    onSubmit(state.forms[formName as string]?.values ?? {})
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} enctype={enctype}>
      <FormsContext.Provider value={formName}>
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
function setField(formName: string, fieldName: string) {
  const { updateField, markTouched } = getFormsActions()

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
