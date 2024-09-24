import yaml from 'js-yaml'
import { readFile } from 'fs/promises'

type Validation = {
  min?: number // Minimum length
  max?: number // Maximum length
  match?: RegExp // Regular expression for validation
  values?: string[] // Allowed values
}

type Field<T> = {
    type: T
    validation?: Validation | boolean // Validation rules or false
    default?: any // Default value, if applicable
}

type Schemas = {
    [schema: string]: {
        [field: string]: Field<any>
    }
}

type Endpoint = {
  method: string
  url: string
  fields: string[]
}

type Endpoints = {
    [endpoint: string]: Endpoint
}

type GridItemSize = {
  xs?: number
  sm?: number
  md?: number
  lg?: number
}

type GridItemColumn = number | GridItemSize[]

export type GridLayout = {
  layout: {
    [gridId: string]: GridConfig
  }
}

type ComponentConfig = {
  type: string            // JSX component class name
  column: number          // Which column the component is in
  text?: string
  props: {
    [propName: string]: any // Props passed to the JSX component
  }
}

type GridConfig = {
  columns: GridItemColumn // Number or array of size properties (xs, sm, md, lg)
  spacing?: number         // Spacing property for Grid component
  wrap?: boolean          // Wrap property (true = 'wrap', false = 'nowrap')
  direction?: 'row' | 'column' // Direction property ('row' or 'column')
  horizontal?: 'left' | 'center' | 'right' | 'spread' | 'around' | 'evenly' // Maps to justifyContent
  vertical?: 'top' | 'middle' | 'bottom' | 'stretch' | 'baseline' // Maps to alignItems
  components: {
    [componentId: string]: ComponentConfig
  }
}

type Pages = {
  [page: string]: {
    name: string
    layout: GridLayout  
  }
}

type Yaml = {
  schema: Schemas
  pages: Pages
  endpoints: Endpoints
}

function getType () {
  // TODO
}

/**
 *
 */
export async function openYaml (path: string): Yaml {
  const config = await readFile(path, 'utf-8')
  return yaml.load(config)
}

export async function generateCode (config: Yaml | string): void {
  const yaml = typeof config === 'string'
    ? await openYaml(config)
    : config

  const schema = null

  const pages = null

  const endpoints = null
}
