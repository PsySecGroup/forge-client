// import yaml from 'js-yaml'
// import { readFile } from 'fs/promises'
// import { getFieldType } from './types'
const yaml = require('js-yaml')
const { readFile } = require('fs/promises')
const { getFieldType } = require('./types')
const { generateConcept } = require('./concept')
const { generateEndpoint } = require('./endpoints')
const { generatePage } = require('./pages')

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

  // Generate concepts
  for (const conceptName of Object.keys(concepts)) {
    const conceptCode = await generateConcept(conceptName, concepts[conceptName].persisting, concepts[conceptName].properties, true)
    //console.log(conceptCode)
  }

  // Generate endpoints
  for (const endpointName of Object.keys(endpoints)) {
    const endpointCode = await generateEndpoint(endpointName, endpoints[endpointName], true)
    //console.log(endpointCode)
  }

  // Generate pages
  for (const page of pages) {
    const pageCode = await generatePage(page)
    console.log(page, pageCode)
  }
}

async function main () {
  await generateCode('../../tests/test.yaml')
}

main()