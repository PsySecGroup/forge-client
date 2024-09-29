// import { type GridLayout } from './layout'
// import { modifyFile, toCamelCaseVariants } from './utils'
// import { writeFile } from 'fs/promises'

const { modifyFile, toCamelCaseVariants } = require('./utils')
const { writeFile } = require('fs/promises')
const { generateLayout } = require('./layout')

const singleQuote = /'/g

/**
 *
 */
const getPage = (properCase, upperCase, components, stores, grid) => `import type { Style, Class } from '../core/types/index'
import { mergeStyle } from '../core/utils/style'
import { Grid } from '@suid/material'
import { type JSX, createEffect } from 'solid-js'
import { useStoreContext } from '../core'
import useTheme from '@suid/material/styles/useTheme'
${components}

import styles from './css/${properCase}.module.css'

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
exports.generatePage = async function generatePage (page) {
  const { lowerCase, upperCase, properCase } = toCamelCaseVariants(page.name)
  const layout = await generateLayout(page.layout)
  console.log(layout)

  return

  // TODO loop through all the pages
  const code = getPage(properCase, upperCase, layout, [], '')
  
  await modifyFile('../App.tsx', [
    '// (-->) Import pages here'
  ], `import ${upperCase}Page from './pages/${lowerCase}'`)

  await modifyFile('../App.tsx', [
    '        // (-->) Add pages here'
  ], `        '${lowerCase}': <${upperCase}Page />`)

  await writeFile(`../pages/${lowerCase}.tsx`, code, 'utf-8')
  await writeFile(`../pages/${lowerCase}.module.css`, '.page {}', 'utf-8')

  return layout
}
