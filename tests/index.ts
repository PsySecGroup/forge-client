/* bindings.js */

// Example usage
// const notations = [
//   "{users[0].tags[find:id=7].id}",
//   "{7}",
//   "{a}",
//   "{'a'}",
//   "{test[-2]}",
//   "{profile[find:id=2].comments[-4].reactions[filter:mood=\"happy\"]}",
//   "{downloads[group:count]}",
//   "{downloads[sort:count]}",
//   "{downloads[has:'bob']}",
//   "{downloads[slice:0,9]}"
// ]

// notations.forEach(notation => {
//   console.log('Notation:', notation)
//   console.log('AST:', parseBinding(notation))
//   console.log('---')
// })


/* types.js */

// console.log(validateInput('test', 'string', 'test'))
// console.log(validateInput('test', 'phone', '1234567890'))
// console.log(validateInput('test', 'email', 'test@test.com'))
// console.log(validateInput('test', 'name', 'Bob'))
// console.log(validateInput('test', 'guid', '12345678-1234-1234-1234-123456789012'))
// console.log(validateInput('test', 'url', 'www.example.com'))
// console.log(validateInput('test', 'hash', '12345678901234567890123456789012'))
// console.log(validateInput('test', 'color', '#FFFFFF'))
// console.log(validateInput('test', 'slug', 'test-slug'))
// console.log(validateInput('test', 'creditCard', '12345678890123'))
// console.log(validateInput('test', 'comment', 'yo man'))
// console.log(validateInput('test', 'filepath', '/home/user/documents/file.txt'))
// console.log(validateInput('test', 'ip', '8.8.8.8'))
// console.log(validateInput('test', 'password', 'Testpass123!'))
// console.log(validateInput('test', 'csv', 'a,b,c'))
// console.log(validateInput('test', 'xml', `<?xml version="1.0"?>
// <rootElement>
//   <child>Content</child>
// </rootElement>`))
// console.log(validateInput('test', 'address', '123 Main St. #4, Maintown, US 58393'))
// console.log(validateInput('test', 'markdown', ''))
// console.log(validateInput('test', 'json', '{ "a": 5 }'))
// console.log(validateInput('test', 'equation', '1 + 1'))
// console.log(validateInput('test', 'function', '() => {}'))
// console.log(validateInput('test', 'date', '12/01/1945'))
// console.log(validateInput('test', 'base64', 'alsdkjfh'))

// console.log(validateInput('test', 'age', 20))
// console.log(validateInput('test', 'year', 2012))
// console.log(validateInput('test', 'month', 4))
// console.log(validateInput('test', 'day', 15))
// console.log(validateInput('test', 'number', 7))
// console.log(validateInput('test', 'id', 657))
// console.log(validateInput('test', 'float', 4.16))
// console.log(validateInput('test', 'integer', 7))
// console.log(validateInput('test', 'scientific', '+2.32e39'))
// console.log(validateInput('test', 'percentage', 46))
// console.log(validateInput('test', 'currency', '4.24'))
// console.log(validateInput('test', 'timestamp', Date.now()))
// console.log(validateInput('test', 'coordinates', [25, 29.3949]))
// console.log(validateInput('test', 'hexadecimal', 'AF49B'))
// console.log(validateInput('test', 'binary', '0110100011101010'))
// console.log(validateInput('test', 'byteSize', 34))

// console.log(validateInput('test', '{user[0].name}', "bob"))
