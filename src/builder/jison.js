const { readFileSync } = require('fs')
const Jison = require('jison')

const grammar = readFileSync('bindings.jison', 'utf-8')
const parser = new Jison.Parser(grammar)

const tokenNames = [
  'WHITESPACE',
  'LEFT_SQUARE',
  'RIGHT_SQUARE',
  'COLON',
  'EQUAL',
  'LESSER_THAN',
  'GREATER_THAN',
  'LESSER_THAN_OR_EQUAL',
  'GREATER_THAN_OR_EQUAL',
  'NOT_EQUAL',
  'FIND',
  'FILTER',
  'GROUP',
  'HAS',
  'SORT',
  'EVERY',
  'SOME',
  'DOT',
  'COMMA',
  'IDENTIFIER',
  'SINGLE_QUOTE',
  'DOUBLE_QUOTE',
  'EOF',
  'SKIP'
];

function extractTokens(input, tokenPatterns) {
  let tokens = [];
  let remainingInput = input;

  while (remainingInput) {
    let matched = false;

    for (const pattern of tokenPatterns) {
      const match = remainingInput.match(pattern);
      if (match) {
        // Get the matched token
        const token = match[0];
        
        const name = tokenNames[tokenPatterns.indexOf(pattern)]

        if (name === 'SKIP' || name === 'WHITESPACE') {
          continue
        }

        // Push the token into the tokens array
        tokens.push({ token, name });
        
        // Remove the matched token from the remaining input
        remainingInput = remainingInput.slice(token.length);
        matched = true;
        break; // Break the loop to start matching from the beginning again
      }

    }

    // If no pattern matches, it means we've encountered an unexpected character
    if (!matched) {
      throw new Error(`Unexpected token at "${remainingInput}"`);
    }
  }

  return tokens;
}

function parse (text) {
  let result = text
  const mustaches = /\{[^\}]+\}/g
  const matches = text.match(mustaches)
  

  for (const match of matches) {
    const demustached = match.substring(1, match.length - 1)
    const tokens = extractTokens(demustached, parser.lexer.rules)
    console.log(tokens)
    const parsed = parser.parse(demustached)
    console.log(demustached)
    console.log(parsed)
  }
}

parse(`hello I am {user[find:name='ted'].name.first} and I have {user[filter:name='ted'].length} people with the same`)

exports.parse = parse