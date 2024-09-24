import { openYaml } from './yaml'

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

const standardHtmlComponents = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist',
  'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i',
  'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta',
  'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre',
  'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span',
  'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
])


// TODO populate this based on the core/components directory
const forgeComponents = new Set([
  'badge', 'bottomnavigation', 'breadcrumbs', 'button', 'buttongroup', 'candlestickchart', 'checkbox',
  'datepicker', 'divider', 'input', 'list', 'modal', 'navigation', 'radiogroup', 'select', 'slider', 'switch', 'table'
])

/**
 *
 */
function generateGridContainer(config: GridConfig, gridId: string): string {
  const { spacing, wrap, direction, horizontal, vertical } = config
  
  const wrapProp = wrap === undefined
    ? ''
    : `wrap="${wrap
      ? 'wrap'
      : 'nowrap'
    }"`

  const directionProp = direction
    ? `direction="${direction}"`
    : ''

  const spacingProp = spacing !== undefined
    ? `spacing={${spacing}}`
    : ''

  let justifyContent = ''
  switch (horizontal) {
    case 'left': justifyContent = 'flex-start'; break
    case 'center': justifyContent = 'center'; break
    case 'right': justifyContent = 'flex-end'; break
    case 'spread': justifyContent = 'space-between'; break
    case 'around': justifyContent = 'space-around'; break
    case 'evenly': justifyContent = 'space-evenly'; break
  }
  
  let alignItems = '';
  switch (vertical) {
    case 'top': alignItems = 'flex-start'; break
    case 'middle': alignItems = 'center'; break
    case 'bottom': alignItems = 'flex-end'; break
    case 'stretch': alignItems = 'stretch'; break
    case 'baseline': alignItems = 'baseline'; break
  }
  
  const styling = []

  justifyContent !== '' && styling.push(`justifyContent: '${justifyContent}'`)
  alignItems !== '' && styling.push(`alignItems: '${alignItems}'`)

  const sxProp = styling.length > 0
    ? `sx={{\n  ${styling.join(',\n  ')}\n}}`
    : ''

  const properties = [spacingProp, wrapProp, directionProp, sxProp]
    .filter(i => i !== '')
    .join(' ')


  return `<Grid container ${properties}>`
}

/**
 *
 */
function generateGridColumns (gridConfig) {
  const columns = []
  const columnsIsNumber = typeof gridConfig.columns === 'number'
  const maxColumns = columnsIsNumber
    ? gridConfig.columns
    : Object.keys(gridConfig.columns).length

  for (let i = 0; i < maxColumns; i++) {
    let item = ''

    if (columnsIsNumber) {
      item = `  <Grid item lg={${12 / gridConfig.columns}}>`
    } else {
      const xsProp = gridConfig.columns[i].xs !== undefined
        ? `xs={${gridConfig.columns[i].xs}}`
        : ''

      const smProp = gridConfig.columns[i].sm !== undefined
        ? `sm={${gridConfig.columns[i].sm}}`
        : ''

      const mdProp = gridConfig.columns[i].md !== undefined
        ? `md={${gridConfig.columns[i].md}}`
        : ''

      const lgProp = gridConfig.columns[i].lg !== undefined
        ? `lg={${gridConfig.columns[i].lg}}`
        : ''

      const sizing = [xsProp, smProp, mdProp, lgProp]
        .filter(i => i !== '')
        .join(' ')
      item = `  <Grid item ${sizing}>`
    }

    columns.push(item)
  }

  return columns
}

/**
 * 
 */
function generateGridItem(config: ComponentConfig, componentId: string): string {
  const { type, column, props, text = '' } = config

  const propEntries = props !== undefined
    ? Object.entries(props).map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join(' ')
    : ''
  
  const componentTag = text == undefined || text === ''
    ? `  <${type} ${propEntries} />`
    : `  <${type} ${propEntries}>${text}</${type}>`

  return `  ${componentTag}`
}

/**
 *
 */
export async function generateLayout(yamlPath: string): string {
  // TODO take just the layout, the yaml file will be opened in the page generator
  const layout = await openYaml(yamlPath)/* as GridLayout*/
  const imports = {}
  let grids = ''

  Object.entries(layout.layout).forEach(([gridId, gridConfig]) => {
    // Generate <Grid> container based on gridConfig
    const gridContainer = generateGridContainer(gridConfig, gridId)
    const columns = generateGridColumns(gridConfig)
    const components = []

    // Generate each component within the grid
    Object.entries(gridConfig.components).forEach(([componentId, componentConfig]) => {
      const typeName = componentConfig.type.toLowerCase()
      const columnIndex = (componentConfig.column - 1) || 0

      if (forgeComponents.has(typeName)) {
        imports[componentConfig.type] = `../core/components/${typeName}`
      } else if(standardHtmlComponents.has(componentConfig.type.toLowerCase()) === false) {
        imports[componentConfig.type] = `./components/${typeName}`
      }

      if (components[columnIndex] === undefined) {
        components[columnIndex] = []
      }

      components[columnIndex].push(generateGridItem(componentConfig, componentId))
    })

    grids += `${gridContainer}\n` + columns.map((grid, i) => {
      if (components[i] === undefined) {
        throw new Error(`Grid ${gridId} has ${columns.length} expected columns, but no components exist in column ${i + 1}`)
      }

      return `${grid}
${components[i].join('\n')}
  </Grid>`
    }).join('\n') + `\n</Grid>\n`
  }) 

  const importText = Object.entries(imports).map(([i, path]) => `import { ${i} } from '${path}'`).join('\n')
 
  return `${importText}\n\n${grids}`
}

// async function main () {
//   console.log(await generateLayout('../../test.yaml'))  
// }
// main()
