import { createContext, batch } from 'solid-js'
import { createStore } from 'solid-js/store'
import { defineActions } from './actions' // your custom helper

type FormData = {
  values: Record<string, string | number | boolean>
  touched: Record<string, boolean>
  dirty: Record<string, boolean>
}

type FormDefinition = {
  forms: Record<string, FormData>
}

const definition: FormDefinition = {
  forms: {}
}

export const store = createStore(definition)
const [_, setState ] = store
type SetState = typeof setState

// export const FormsContext = createContext(store)
export const FormsContext = createContext<string | null>(null)
export const FormsStore = store

export const getFormsActions = defineActions(store, (set: SetState) => ({
  initializeForm: (formName: string,  defaultValues: Record<string, any> = {}) =>
    set('forms', formName, (prev = {
      values: defaultValues,
      touched: {},
      dirty: {}
    }) => prev),

  updateField: (formName: string, field: string, value: any) => {
    batch(() => {
      set('forms', formName, 'values', field, value)
      set('forms', formName, 'dirty', field, true)
    })
    console.log(_)
  },

  markTouched: (formName: string, field: string) => {
    set('forms', formName, 'touched', field, true)
  },

  clearForm: (formName: string) =>
    set('forms', formName, {
      values: {},
      touched: {},
      dirty: {}
    }
  )
}))
