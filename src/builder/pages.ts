import { type GridLayout } from './layout'
import { modifyFile, toCamelCaseVariants } from './utls'
import { writeFile } from 'fs/promises'

const singleQuote = /'/g

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

/**
 *
 */
const getPage = (lowerCase, upperCase, components, stores, grid) => `import type { Style, Class } from '../core/types/index'
import { mergeStyle } from '../core/utils/style'
import { Grid } from '@suid/material'
import { type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import useTheme from '@suid/material/styles/useTheme'
${components}

import styles from './css/${lowerCase}.module.css'

type Props = {}

export default function ${upperCase}Page (props: ParentProps<Props> = {}): JSX.Element {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.page
  )

  // State
  const { ${stores} } = useStoreContext()

  // Rendering
  return (
${grid}
  )
}
`

/**
 *
 */
async function generatePage (page: Page) {
  const { lowerCase, upperCase } = toCamelCaseVariants(name)
  // TODO get components
  // TODO get stores
  // TODO get grid
  const page = getPage(lowerCase, upperCase, [], [], '')
  
  await modifyFile('../App.tsx', [
    '// (-->) Import pages here'
  ], `import ${upperCase}Page from './pages/${lowerCase}'`)

  await modifyFile('../App.tsx', [
    '        // (-->) Add pages here'
  ], `        '${lowerCase}': <${upperCase}Page />`)

  await writeFile(`../pages/${lowerCase}.tsx`, page, 'utf-8')
  await writeFile(`../pages/${lowerCase}.module.css`, '.page {}', 'utf-8')

  return concept
}
