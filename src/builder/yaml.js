// import yaml from 'js-yaml'
// import { readFile } from 'fs/promises'
// import { getFieldType } from './types'
const yaml = require('js-yaml')
const { readFile } = require('fs/promises')
const { getFieldType } = require('./types')

// type Validation = {
//   min?: number // Minimum length
//   max?: number // Maximum length
//   match?: RegExp // Regular expression for validation
//   values?: string[] // Allowed values
// }

// type Field<T> = {
//     type: T
//     validation?: Validation | boolean // Validation rules or false
//     default?: any // Default value, if applicable
// }

// type Schemas = {
//     [schema: string]: {
//         [field: string]: Field<any>
//     }
// }

// type Endpoint = {
//   method: string
//   url: string
//   fields: string[]
// }

// type Endpoints = {
//     [endpoint: string]: Endpoint
// }

// type GridItemSize = {
//   xs?: number
//   sm?: number
//   md?: number
//   lg?: number
// }

// type GridItemColumn = number | GridItemSize[]

// export type GridLayout = {
//   layout: {
//     [gridId: string]: GridConfig
//   }
// }

// type ComponentConfig = {
//   type: string            // JSX component class name
//   column: number          // Which column the component is in
//   text?: string
//   props: {
//     [propName: string]: any // Props passed to the JSX component
//   }
// }

// type GridConfig = {
//   columns: GridItemColumn // Number or array of size properties (xs, sm, md, lg)
//   spacing?: number         // Spacing property for Grid component
//   wrap?: boolean          // Wrap property (true = 'wrap', false = 'nowrap')
//   direction?: 'row' | 'column' // Direction property ('row' or 'column')
//   horizontal?: 'left' | 'center' | 'right' | 'spread' | 'around' | 'evenly' // Maps to justifyContent
//   vertical?: 'top' | 'middle' | 'bottom' | 'stretch' | 'baseline' // Maps to alignItems
//   components: {
//     [componentId: string]: ComponentConfig
//   }
// }

// type Pages = {
//   [page: string]: {
//     name: string
//     layout: GridLayout  
//   }
// }

// type Yaml = {
//   schema: Schemas
//   pages: Pages
//   endpoints: Endpoints
// }

function getType () {
  // TODO
}

/**
 *
 */
//export async function openYaml (path: string): Yaml {
async function openYaml (path) {
  const config = await readFile(path, 'utf-8')

  // Escape existing double quotes
  const escapedQuotes = config.replace(/"/g, '\\"');


  const output = escapedQuotes
    .replace(/{(.*?)}/g, (_, variableName) => {
      return `"{${variableName.trim()}}"`
    })
    .replace(/: \[(.+)\]\s?/g, (_, variableName) => {
      return `: "[${variableName.trim()}]"`
    })



  return yaml.load(output)
}

  

//export async function generateCode (config: Yaml | string): void {
async function generateCode (config) {
  const yaml = typeof config === 'string'
    ? await openYaml(config)
    : config

  // Concepts
  const concepts = yaml.concepts

  // Pages
  const pages = []
  for (const pageName of Object.keys(yaml.pages)) {
    const page = {
      name: pageName,
      layout: yaml.pages[pageName].layout
    }

    for (const layoutName of Object.keys(page.layout)) {
      const layout = page.layout[layoutName]

      for (const componentName of Object.keys(layout?.components || {})) {
        const component = layout.components[componentName]
        component.fields = {}
        
        for (const propName of Object.keys(component?.props || {})) {
          const isBinding = typeof component.props[propName] === 'string' && (component.props[propName][0] === '{' || component.props[propName][0] === '[')

          component.fields[propName] = getFieldType(propName, isBinding
            ? component.props[propName]
            : 'string',
            component[propName]
          )
          component.fields[propName].isBinding = isBinding
        }
      }
    }

    pages.push(page)
  }

  const endpoints = yaml.endpoints

  // TODO generate concepts
  // TODO generate endpoints
  // TODO generate pages
}

async function main () {
  await generateCode('../../tests/test.yaml')
}

main()