const bindingPattern = /^\{[^\}]+\}$/

//const regexPatterns: { [key: string]: RegExp } = {
const regexPatterns = {
  // any string
  string: /^.*$/,
  
  // international phone number format
  phone: /^\+?[1-9]\d{1,14}$/,

  // basic email validation
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // name allowing letters, spaces, apostrophes, hyphens
  name: /^[a-zA-Z\s'-]+$/,
  
  // UUID format
  guid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  
  // HTTP/HTTPS/FTP URLs
  url: /^((https?|ftp):\/\/)?[^\s/$.?#].[^\s]*$/,
  
  // Hashes like MD5 (32 chars) or SHA256 (64 chars)
  hash: /^[a-f0-9]{32,64}$/,
  
  // Hex color code (3, 6, or 8 characters)
  color: /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8}|[0-9a-fA-F]{3})$/,

  // URL slug with lowercase and hyphens
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  // Simple credit card number validation (no Luhn check)
  creditCard: /^\d{13,19}$/,

  // Any string for comments
  comment: /^.*$/,

  // Windows or Unix file paths
  filepath: /^([a-zA-Z]:\\|\/)?([\w-]+(\/|\\))*[\w-]+\.[a-zA-Z]+$/,

  // IPv4
  ip: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,

  // Strong password: min 8 chars, at least one uppercase, lowercase, digit, special char
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,

  // CSV format (basic comma-separated validation)
  csv: /^(\s*[^,\r\n]+(?:,[^,\r\n]*)*\s*)$/,

  // Simple XML validation
  xml: /^<\?xml.*\?>[\s\S]+<\/[a-zA-Z0-9]+>$/,

  // Basic address validation allowing common punctuation
  address: /^[\w\s.,#'-]+$/,

  // Any valid markdown is accepted
  markdown: /^.*$/, 

  // JSON format (handles nested objects/arrays)
  json: /^(?:\{(?:[^{}]|(?:\{.*\}))*\}|\[(?:[^\[\]]|(?:\[.*\]))*\])$/,

  // Basic math equation (includes operators and parentheses)
  equation: /^[\d\s\+\-\*\/\(\)\^]+$/,

  // Regular and arrow functions
  function: /^(function\s*\([\s\S]*\)\s*\{[\s\S]*\}|(\([\s\S]*\)\s*=>\s*\{[\s\S]*\}))$/,

  // ISO 8601 date format (YYYY-MM-DD)
  date: /^(\d{4}[-|/]\d{1,2}[-|/]\d{1,2})|(\d{1,2}[-|/]\d{1,2}[-|/]\d{4})|(\d{1,2}[-|/]\d{1,2}[-|/]\d{2})$/,

  // Base64 encoding
  base64: /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/,
}

//const numberChecks: { [key: string]: (value) => boolean } = {
const numberChecks = {
  age: (value) => Number.isInteger(value) && value >= 0 && value <= 120,

  year: (value) => Number.isInteger(value) && value >= 0 && value <= new Date().getFullYear(),

  month: (value) => Number.isInteger(value) && value >= 1 && value <= 12,

  day: (value) => Number.isInteger(value) && value >= 1 && value <= 31,

  number: (value) => typeof value === 'number' && !isNaN(value),

  id: (value) => Number.isInteger(value) && value >= 0,

  float: (value) => typeof value === 'number' && !Number.isInteger(value),

  integer: (value) => Number.isInteger(value),
  
  // Scientific notation
  scientific: (value) => /^[+-]?\d+(\.\d+)?e[+-]?\d+$/.test(value.toString()),

  percentage: (value) => typeof value === 'number' && value >= 0 && value <= 100,

  // Allows two decimal points for currencies
  currency: (value) => /^-?\d+(\.\d{1,2})?$/.test(value.toString()),

  timestamp: (value) => typeof value === 'number' && !isNaN(new Date(value).getTime()),

  // Latitude, Longitude validation
  coordinates: (value) => Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number' && v >= -180 && v <= 180),

  // Hexadecimal numbers
  hexadecimal: (value) => /^[0-9a-fA-F]+$/.test(value.toString()), 

  // Binary numbers
  binary: (value) => /^[01]+$/.test(value.toString()),

  // Non-negative integer for file size
  byteSize: (value) => Number.isInteger(value) && value >= 0,
}

/**
 *
 */
//export function validateInput(name: string, type: string, defaultValue: any === undefined): boolean {
function validateInput(name, type, defaultValue) {
  const isString = type in regexPatterns
  const isNumber = type in numberChecks && numberChecks[type]
  const isBinding = type.test(bindingPattern)
  const isType = isString === false && isNumber === false && isBinding === false

  if (defaultValue !== undefined) { 
    if(isString && regexPatterns[type].test(defaultValue) === false) {
      throw new Error(`${name} has a type of ${type}, but the default value (${defaultValue}) is not ${type}`)
    } else if (isNumber && numberChecks[type](defaultValue) === false) {
      throw new Error(`${name} has a type of ${type}, but the default value (${defaultValue}) is not ${type}`)
    }
  }

  if (isBinding) {
    const parts = 
    return {
      name,
      type: 'binding',
      defaultValue: type,
      validation: undefined,
      base: 
    }
  } else {

    const validation = isString
      ? `(value => value.test(${regexPatterns[type].source}))`
      : isNumber
        ? numberChecks[type].toString()
        : undefined

    return {
      name,
      type,
      defaultValue,
      validation,
      base: isString
        ? 'string'
        : isNumber
          ? 'number'
          : 'type'
    }
  }
}

const a = console.log

a(validateInput('test', 'string', 'test'))
a(validateInput('test', 'phone', '1234567890'))
a(validateInput('test', 'email', 'test@test.com'))
a(validateInput('test', 'name', 'Bob'))
a(validateInput('test', 'guid', '12345678-1234-1234-1234-123456789012'))
a(validateInput('test', 'url', 'www.example.com'))
a(validateInput('test', 'hash', '12345678901234567890123456789012'))
a(validateInput('test', 'color', '#FFFFFF'))
a(validateInput('test', 'slug', 'test-slug'))
a(validateInput('test', 'creditCard', '12345678890123'))
a(validateInput('test', 'comment', 'yo man'))
a(validateInput('test', 'filepath', '/home/user/documents/file.txt'))
a(validateInput('test', 'ip', '8.8.8.8'))
a(validateInput('test', 'password', 'Testpass123!'))
a(validateInput('test', 'csv', 'a,b,c'))
a(validateInput('test', 'xml', `<?xml version="1.0"?>
<rootElement>
  <child>Content</child>
</rootElement>`))
a(validateInput('test', 'address', '123 Main St. #4, Maintown, US 58393'))
a(validateInput('test', 'markdown', ''))
a(validateInput('test', 'json', '{ "a": 5 }'))
a(validateInput('test', 'equation', '1 + 1'))
a(validateInput('test', 'function', '() => {}'))
a(validateInput('test', 'date', '12/01/1945'))
a(validateInput('test', 'base64', 'alsdkjfh'))

a(validateInput('test', 'age', 20))
a(validateInput('test', 'year', 2012))
a(validateInput('test', 'month', 4))
a(validateInput('test', 'day', 15))
a(validateInput('test', 'number', 7))
a(validateInput('test', 'id', 657))
a(validateInput('test', 'float', 4.16))
a(validateInput('test', 'integer', 7))
a(validateInput('test', 'scientific', '+2.32e39'))
a(validateInput('test', 'percentage', 46))
a(validateInput('test', 'currency', '4.24'))
a(validateInput('test', 'timestamp', Date.now()))
a(validateInput('test', 'coordinates', [25, 29.3949]))
a(validateInput('test', 'hexadecimal', 'AF49B'))
a(validateInput('test', 'binary', '0110100011101010'))
a(validateInput('test', 'byteSize', 34))

a(validateInput('test', 'User', { a: 'hello' }))
