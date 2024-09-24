const numbersPattern = `[0-9\-]`
const transformsPattern = `(find|filter|extract|has|every|sort|sortAsc|sortDesc|group|slice):`
const variablePattern = `[a-zA-Z0-9\-'"\`,]`
const operatorsPattern = `(=|==|===|<=|<|>|=>|!|!=|!==)`
const arrayPatterns = new RegExp(`${numbersPattern}|(${transformsPattern}(${variablePattern}+)\s?${operatorsPattern}?\s?(${variablePattern}*))`)
const digitPattern = /^\d+$/
const negativeDigitPattern = /^-?\d+$/
const stringPattern = /^'[^']*'$/
const storePattern = /^[a-zA-Z]+$/
const segmentationPattern = /^([a-zA-Z0-9_]+)(?:\[(.+)\])?$/

// type Binding = {
//   segment: string
//   target: string
//   index: string | null
//   type: string
// }

// export function function parseBinding(notation: string): Binding[] {
exports.parseBinding = function parseBinding(notation) {
  const expression = notation.trim().slice(1, -1)
  
  const ast = []

  // Handle special cases for primitive or store-like notation (single element, no dots/brackets)
  if (digitPattern.test(expression)) {
    // It's a number (primitive)
    ast.push({
      segment: expression,
      target: Number(expression),
      index: null,
      type: 'primitive'
    })
  } else if (stringPattern.test(expression)) {
    // It's a string wrapped in single quotes (primitive)
    ast.push({
      segment: expression,
      target: expression.slice(1, -1),
      index: null,
      type: 'primitive'
    })
  } else if (storePattern.test(expression)) {
    // It's a store name (no dots, no quotes, no brackets)
    ast.push({
      segment: expression,
      target: expression,
      index: null,
      type: 'store'
    })
  } else {
    // Complex cases with dots and brackets
    let segments = expression.split('.')
    
    segments.forEach(segment => {
      const match = segment.match(segmentationPattern)

      if (match) {
        const target = match[1]
        let index = null
        let type = 'property' // default to property

        if (match[2]) {
          // It's an array if it contains brackets
          const indexExpression = match[2];

          // Updated Regex to match new operations like find, filter, etc.
          const complexIndexMatch = indexExpression.match(arrayPatterns)

          if (digitPattern.test(indexExpression)) {
            // Regular numeric index
            index = Number(indexExpression)
            type = 'array'
          } else if (negativeDigitPattern.test(indexExpression)) {
            // Negative index
            index = `${target}[${target}.length ${indexExpression >= 0
              ? '+'
              : '-'} ${indexExpression.replace('-', '')}]`
            type = 'array'
          } else if (complexIndexMatch) {
            const operator = complexIndexMatch[2]
            const key = complexIndexMatch[3]
            const value = complexIndexMatch[5]
            let comparisonOperator = ''

            switch (complexIndexMatch[4]) {
              case '=':
              case '==':
                comparisonOperator = '==='
                break
              case '!=':
                comparisonOperator = '!=='
                break
              default:
                comparisonOperator = complexIndexMatch[4]
            }

            switch (operator) {
              case 'find':
                index = `${target}.find(e => e.${key} ${comparisonOperator} ${value})`
                break
              case 'filter':
                index = `${target}.filter(e => e.${key} ${comparisonOperator} ${value})`
                break
              case 'extract':
                index = `${target}.extract(e => e.${key} ${comparisonOperator} ${value})`
                break
              case 'has':
                index = `${target}.indexOf(${key}) > -1`
                break
              case 'every':
                index = `${target}.every(e => e.${key} ${comparisonOperator} ${value})`
                break
              case 'slice':
                const parts = key.split(',').map(k => k === undefined
                  ? ''
                  : k
                )
                index = `${target}.slice(${parts[0]},${parts[1]})`
                break
              case 'group':
                index = `${target}.reduce((acc, e) => {
  (acc[e.${key}] = acc[e.${key}] || []).push(e)
  return acc
}, {})`
                break
              case 'sort':
              case 'sortAsc':
                index = `${target}.sort((a,b) => {
  const typeA = typeof a

  if (typeA === 'number') {
    return a - b
  } else if (typeA === 'boolean') {
    return a === b ? 0 : a ? 1 : -1
  } else if (typeA === 'string') {
    return a.localeCompare(b)
  }

  return 0
})`
                break
              case 'sortDesc':
                index = `${target}.sort((b, a) => {
  const typeB = typeof b

  if (typeB === 'number') {
    return a - b
  } else if (typeB === 'boolean') {
    return a === b ? 0 : a ? 1 : -1
  } else if (typeB === 'string') {
    return a.localeCompare(b)
  }

  return 0
})`
                break
            }

            type = 'array'
          }
        }
        
        ast.push({
          segment,
          target,
          index,
          type,
        });
      } else {
        throw new Error(`"${segment}" of "${notation}" is an invalid notation.`)
      }
    });
  }

  return ast
}
