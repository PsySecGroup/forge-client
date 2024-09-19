import { modifyFile, toCamelCaseVariants } from './utls'
import { writeFile } from 'fs/promises'

const singleQuote = /'/g

type StoreType = 'temporaryStore' | 'persisting'

/**
 *
 */
function generateTypeScriptAndDefaults(input) {
  let definitions = []
  let defaults = []
  let conceptRegister = []
  let stateRegister = []
  let hydration = []

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'number') {
      // Number

      definitions.push(`  ${key}: number`)
      defaults.push(`  ${key}: ${value}`)
    } else if (typeof value === 'string') {
      // String

      if (value.startsWith('class:')) {
        // Classes
        const className = value.split(':')[1]
        const { lowerCase, upperCase } = toCamelCaseVariants(className)
        definitions.push(`  ${key}: ${className}`)
        defaults.push(`  ${key}: new ${className}()`)

        if (lowerCase !== 'date') {
          conceptRegister.push(`import { defaultState as ${lowerCase}Defaults } from './${lowerCase}'`)
          stateRegister.push(`import {type StoreState as ${upperCase}StoreState, getStore as get${upperCase}Store } from '../concepts/${lowerCase}'`)
        } else {
          hydration.push(`  result.${key} = hydrateDate(result, '${key}')`)
        }

      } else {
        // Strings
        definitions.push(`  ${key}: string`)
        defaults.push(`  ${key}: '${value.replace(singleQuote, "\'")}'`)
      }
    } else if (Array.isArray(value)) {
      // Arrays

      const typeOf = typeof value[0]

      const isClass = typeOf === 'string'
        ? value[0].startsWith('class:')
        : false

      const className = isClass
        ? value[0].split(':')[1]
        : ''

      const elementType = isClass
        ? className
        : typeOf
      
      let values = ''
      
      if (isClass) {
        // Class Array
        values = value
          .map(e => `new ${className}()`)
          .join(', ')
        hydration.push(`  result.${key} = hydrateCollection<Concept>(result.${key}, hydrate)`)
      } else if (elementType === 'string') {
        // String array
        values = value
          .map(e => `'${e.replace(singleQuote, "\'")}'`)
          .join(', ')
      } else {
        // Primitive Array
        values = value.join(', ')
      }

      definitions.push(`  ${key}: ${elementType}[]`)
      defaults.push(`  ${key}: [${values}]`)
    } else if (value === null) {
      // Null

      definitions.push(`  ${key}: null`)
      defaults.push(`  ${key}: null`)
    } else if (typeof value === 'boolean') {
      // Boolean

      definitions.push(`  ${key}: boolean`)
      defaults.push(`  ${key}: ${value}`)
    } else if (value === undefined) {
      // Undefined

      definitions.push(`  ${key}: undefined`)
      defaults.push(`  ${key}: undefined`)
    }
  }

  return { 
    definitions: definitions.join('\n'),
    defaults: defaults.join(',\n'),
    conceptRegister: conceptRegister.join('\n'),
    stateRegister: stateRegister.join('\n'),
    hydration: hydration.join('\n')
  }
}

/**
 *
 */
const getConcept = (storeType, properCase, lowerCase, definitions, defaults, hydration) => `import type { SetStoreFunction } from 'solid-js/store'
import type { Json } from '../core/types'
import { NOOP } from '../constants'
import { ${storeType}Store, hydrateJson, hydrateCollection, hydrateDate } from '../core'

export type ${properCase} = {
  // (-->) Add simple primitives here
${definitions}
}

type Concept = ${properCase}

export type StoreState = {
  ${lowerCase}: Concept
  set${properCase}: SetStoreFunction<Concept>
}

const defaultValues: Concept = {
  // (-->) Add simple primitive default values here
${defaults}
}

/**
 *
 */
export function hydrate (json: string | Concept | Json = {}): Concept {
  const result = hydrateJson<Concept>(json, defaultValues)

  // (-->) If complex hydration is needed for arrays or dates, it is done here
${hydration}

  return result
}

export const defaultState: StoreState = {
  ${lowerCase}: hydrate(),
  set${properCase}: NOOP
}

export const getStore = (): StoreState => {
  const [${lowerCase}, set${properCase}] = ${storeType}Store<Concept>(defaultValues)

  return {
    ${lowerCase},
    set${properCase}
  }
}
`

/**
 *
 */
async function generateConcept (name, storeType, data) {
  const { lowerCase, upperCase } = toCamelCaseVariants(name)
  const { definitions, defaults, conceptRegister, stateRegister, hydration } = generateTypeScriptAndDefaults(data)
  const concept = getConcept(storeType, upperCase, lowerCase, definitions, defaults, hydration)
  
  await modifyFile('../concepts/register.ts', [
    '// (-->) Import new concept default states here'
  ], `import { defaultState as ${lowerCase}Defaults } from './${lowerCase}'`)

  await modifyFile('../concepts/register.ts', [
    '  // (-->) Add default states here'
  ], `  ...${lowerCase}Defaults,`)

  await modifyFile('../state/register.ts', [
    '// (-->) Import the StoreState and getStore for Concepts here'
  ], `import { type StoreState as ${upperCase}StoreState, getStore as get${upperCase}Store } from '../concepts/${lowerCase}'`)

  await modifyFile('../state/register.ts', [
    '  // (-->) Register StoreStates here'
  ], `  & ${upperCase}StoreState`)

  await modifyFile('../state/register.ts', [
    '  // (-->) Register getStores here'
  ], `  get${upperCase}Store,`)

  await writeFile(`../concepts/${lowerCase}.ts`, concept, 'utf-8')

  return concept
}

// generateConcept('test', 'temporary', {
//     a: 7,
//     b: null,
//     c: "cat",
//     d: undefined,
//     e: [7, 4, 3, 5],
//     f: "class:User",
//     g: true,
//     h: "class:Date",
//     i: ["class:User", "class:User", "class:User"]
// })