import { onCleanup, onMount, useContext } from 'solid-js'
import { JSX, ParentProps } from 'solid-js'
import { FormsStore, FormsContext, getFormsActions } from './store'

type FormValues = Record<string, any>
type ValidationErrors = [string, string][]

type HTMLFormEncType =
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'text/plain'

type Props<ResponseType> = {
  id?: string
  name?: string
  enctype?: HTMLFormEncType
  beforeSubmit?: (formData: FormValues) => FormValues | ValidationErrors
  onSubmit?: (formData: FormValues) => Awaited<ResponseType>
  afterSubmit?: (response: ResponseType, formData: FormValues) => FormValues
  onError?: (errors: ValidationErrors, formData: FormValues) => void
} & ParentProps

/**
 * 
 */
export function Form<ResponseType = FormValues>({
  id,
  name,
  enctype = 'application/x-www-form-urlencoded',
  beforeSubmit,
  onSubmit,
  afterSubmit,
  onError,
  children
}: Props<ResponseType>): JSX.Element {
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

  /**
   * 
   */
  async function handleSubmit(e: Event) {
    e.preventDefault()

    const name = formName as string
    const values = state.forms[name]?.values ?? {}
    let refinedValues: FormValues | [string, string][] = values

    try {
      if (beforeSubmit) {
        refinedValues = await beforeSubmit(values)

        if (Array.isArray(refinedValues) && refinedValues.length > 0) {
          console.warn('Validation Error:', refinedValues)

          if (onError) {
            await onError(refinedValues, values)
            return false
          }
        }
      }

    const response: ResponseType = onSubmit === undefined
      ? refinedValues as ResponseType
      : await onSubmit(refinedValues)

      if (afterSubmit) {
        await afterSubmit(response, refinedValues)
      }
    } catch (err: unknown) {
      console.error('Form submission error:', err)

      if (onError) {
        const message = err instanceof Error ? err.message : String(err)
        await onError([['*', message]], refinedValues)
        return false
      }
    }

    return true
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
