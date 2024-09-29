const { getFieldType } = require('./types')
const { toCamelCaseVariants } = require('./utils')

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
//function generateGridContainer(config: GridConfig, gridId: string): string {
function generateGridContainer(config, gridId) {
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
//function generateGridItem(config: ComponentConfig, componentId: string): string {
function generateGridItem(componentId, config, props) {
  const { type, column, text = '' } = config
  let propEntries = []

  for (const propName of Object.keys(props)) {
    const value = props[propName].defaultValue
    if (value instanceof Array) {
      propEntries.push(`${propName}={${props[propName]
        .defaultValue.map(field => field.segment)
        .join('?.')
      }}`)
    } else {
      propEntries.push(`${propName}={${value}}`)
    }
  }

  
  const componentTag = text == undefined || text === ''
    ? `  <${type} ${propEntries.join(' ')} />`
    : `  <${type} ${propEntries.join(' ')}>${text}</${type}>`
  return `  ${componentTag}`
}

/**
 *
 */

exports.generateLayout = async function generateLayout(layout) {
  const result = []


  Object.entries(layout).forEach(([gridId, gridConfig]) => {
    const imports = []

    const record = {
      grids: '',
      imports: '',
      stores: {}
    }

    // Generate <Grid> container based on gridConfig
    const gridContainer = generateGridContainer(gridConfig, gridId)
    const columns = generateGridColumns(gridConfig)
    const components = []

    // Generate each component within the grid
    Object.entries(gridConfig.components).forEach(([componentId, componentConfig]) => {
      const props = {}

      for (const propName of Object.keys(componentConfig.props || {})) {
        const prop = componentConfig.props[propName]
        const field = getFieldType(propName, prop, prop)
        props[propName] = field
        
        if (field.type === 'binding') {
          const base = field.defaultValue[0].target

          if (base !== 'endpoint' && base !== 'persist') {
            record.stores[base] = true
          }
        }
      }

      const { lowerCase, upperCase, properCase } = toCamelCaseVariants(componentConfig.type)

      if (forgeComponents.has(lowerCase)) {
        imports[componentConfig.type] = `../core/components/${properCase}`
      } else if(standardHtmlComponents.has(lowerCase) === false) {
        imports[componentConfig.type] = `./components/${properCase}`
      }

      const columnIndex = (componentConfig.column - 1) || 0

      if (components[columnIndex] === undefined) {
        components[columnIndex] = []
      }

      components[columnIndex].push(generateGridItem(componentId, componentConfig, props))
    })

    // TODO make sure we can loop correctly to account for all pages

    record.grids += `${gridContainer}\n` + columns.map((grid, i) => {
      if (components[i] === undefined) {
        throw new Error(`Layout "${gridId}" has ${columns.length} expected columns, but no components exist in column ${i + 1}`)
      }

    record.imports = Object.entries(imports).map(([i, path]) => `import { ${i} } from '${path}'`).join('\n')

      return `${grid}
${components[i].join('\n')}
  </Grid>`
    }).join('\n') + `\n</Grid>\n`
  }) 
 
  return result
}
