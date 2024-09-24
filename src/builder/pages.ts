import { type GridLayout } from './layout'
import { modifyFile, toCamelCaseVariants } from './utls'
import { writeFile } from 'fs/promises'

const singleQuote = /'/g

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
