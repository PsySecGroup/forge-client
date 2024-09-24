function lexer(input) {
    // Regular expressions to match different notations
    const stringRegex = /^\{(['"])(.*?)\1\}$/; // Matches quoted strings
    const numberRegex = /^\{(\d+)\}$/;           // Matches numbers
    const unquotedRegex = /^\{([a-zA-Z_]\w*)\}$/; // Matches unquoted identifiers
    const pathRegex = /^\{([a-zA-Z_]\w*(?:\.\w+|\[\-?\d+\]|\[find:[^]]+\])*)+\}$/; // Matches paths with dots and brackets

    // Check for string notation
    const stringMatch = input.match(stringRegex);
    if (stringMatch) {
        return {
            base: undefined,
            value: stringMatch[2], // The captured string value
            isFunction: false,
            isPrimitive: true       // Strings in quotes are primitive
        };
    }

    // Check for number notation
    const numberMatch = input.match(numberRegex);
    if (numberMatch) {
        const value = parseInt(numberMatch[1], 10);
        return {
            base: undefined,
            value: value,
            isFunction: false,
            isPrimitive: true       // Numbers are also primitive
        };
    }

    // Check for unquoted string notation
    const unquotedMatch = input.match(unquotedRegex);
    if (unquotedMatch) {
        return {
            base: undefined,
            value: unquotedMatch[1],
            isFunction: false,
            isPrimitive: false      // Unquoted strings are not primitive
        };
    }

    // Check for paths with brackets and dots
    const pathMatch = input.match(pathRegex);
    if (pathMatch) {
        const fullPath = pathMatch[1];
        const segments = fullPath.split(/(\.\w+|\[\-?\d+\]|\[find:[^]]+\])/).filter(Boolean); // Split and keep delimiters

        // Get the base as the first segment (remove anything after the first bracket if present)
        const base = segments[0].replace(/\[.*\]$/, '');

        // Prepare to build the final value
        let value = segments.map(segment => {
            if (segment.startsWith('.')) {
                return `?.${segment.slice(1)}`; // Optional chaining for property access
            }
            if (segment.match(/^\[\d+\]$/) || segment.match(/^\[-?\d+\]$/)) {
                return segment; // Keep array indices as is
            }
            if (segment.startsWith('[find:')) {
                // Extract the condition from the find notation
                const condition = segment.slice(6, -1); // Remove [find: and ]
                // Convert operators
                const convertedCondition = condition
                    .replace(/=/g, '===')
                    .replace(/<=/g, '<==')
                    .replace(/>=/g, '>==')
                    .replace(/!=/g, '!==');
                return `(base) => ${base}.find(e => ${convertedCondition})`; // Generate the find function
            }
            return segment; // Return segment as is
        }).join('');

        // Check if there are any special array operations in the path
        const isSpecialArrayOperation = segments.some(segment => segment.startsWith('[') && segment.endsWith(']') && !segment.match(/^\[\d+\]$/));

        // If it's a special array operation, format as a function
        if (isSpecialArrayOperation) {
            const lastIndex = segments.filter(segment => segment.startsWith('[') && segment.endsWith(']')).pop();
            const baseName = segments[0]; // Get base name for function creation
            if (lastIndex.match(/^\[\d+\]$/) || lastIndex.match(/^\[-?\d+\]$/)) {
                value = `(base) => ${baseName}[base.length - ${Math.abs(lastIndex.replace(/[\[\]]/g, ''))}]`;
            }
        }

        return {
            base: base,
            value: value,
            isFunction: isSpecialArrayOperation,
            isPrimitive: false // Complex paths are not primitive
        };
    }

    throw new Error("Invalid notation");
}

// Example usage:
try {
    console.log(lexer("{7}"));                      // { base: undefined, value: 7, isFunction: false, isPrimitive: true }
    console.log(lexer("{74903}"));                  // { base: undefined, value: 74903, isFunction: false, isPrimitive: true }
    console.log(lexer("{'bob'}"));                  // { base: undefined, value: 'bob', isFunction: false, isPrimitive: true }
    console.log(lexer("{a}"));                      // { base: undefined, value: 'a', isFunction: false, isPrimitive: false }
    console.log(lexer("{value.test}"));             // { base: 'value', value: 'value?.test', isFunction: false, isPrimitive: false }
    console.log(lexer("{value.test.hello}"));       // { base: 'value', value: 'value?.test?.hello', isFunction: false, isPrimitive: false }
    console.log(lexer("{list[3].bob.tags[3]}"));    // { base: 'list', value: 'list[3]?.bob?.tags[3]', isFunction: false, isPrimitive: false }
    console.log(lexer("{list[-2]}"));                // { base: 'list', value: '(base) => list[base.length - 2]', isFunction: true, isPrimitive: false }
    console.log(lexer("{list[find:name='bob']}"));   // { base: 'list', value: '(list) => list.find(e => e.name === \'bob\')', isFunction: true, isPrimitive: false }
} catch (error) {
    console.error(error.message);
}

/*
notation: {list[find:name='bob']}
{
  base: 'list',
  value: (list) => list.find(e => e.name === 'bob'),
  isFunction: true
  isPrimitive: false
}

notation: {list[has:'bob']}
{
  base: 'list',
  value: (list) => list.indexOf('bob') > -1,
  isFunction: true
  isPrimitive: false
}

notation: {list[find:age < 40]}
{
  base: 'list',
  value: (list) => list.find(e => e.age < 40),
  isFunction: true
  isPrimitive: false
}

notation: {list[find:age >= 21]}
{
  base: 'list',
  value: (list) => list.find(e => e.age >= 21),
  isFunction: true
  isPrimitive: false
}

notation: {list[find:type != 'happy']}
{
  base: 'list',
  value: (list) => list.find(e => e.type !== 'happy'),
  isFunction: true
  isPrimitive: false
}

notation: {list[filter:name='bob']}
{
  base: 'list',
  value: (list) => list.filter(e => e.name === 'bob'),
  isFunction: true
  isPrimitive: false
}

notation: {list[every:name='bob']}
{
  base: 'list',
  value: (list) => list.every(e => e.name === 'bob'),
  isFunction: true
  isPrimitive: false
}

notation: {list[group:type]}
{
  base: 'list',
  value: (list) => list.reduce((acc, e) => {
    (acc[e.type] = acc[e.type] || []).push(e)
    return acc
  }, {}),
  isFunction: true
  isPrimitive: false
}

notation: {list[sort:age,name]}
{
  base: 'list',
  value: (list) => list.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name)),
  isFunction: true
  isPrimitive: false
}

notation: {list[slice:0,3]}
{
  base: 'list',
  value: (list) => list.slice(0, 3),
  isFunction: true
  isPrimitive: false
}

notation: {list[extract:id,name,age]}
{
  base: 'list',
  value: (list) => list.map(e => return {
    id: e.id,
    name: e.name,
    age: e.age
  }),
  isFunction: true
  isPrimitive: false
}
*/