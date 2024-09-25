const { modifyFile, toCamelCaseVariants } = require('./utils')
const { writeFile } = require('fs/promises')
  /*
}
{
  FetchUser: { method: 'GET', url: '/api/user' },
  UpdateUser: { method: 'POST', url: '/api/user/update', fields: [ 'name' ] },
  FetchComments: { method: 'GET', url: '/api/comments' },
  CreateComment: {
    method: 'POST',
    url: '/api/comment/create',
    fields: [ 'text', 'userId' ]
  }
}
  */

const getEndpoint = (name, importConcept, conceptUpperCase, method, url, fields) => `import type { Dynamic, Json, HttpMethods } from '../core/types/index'
import { fetch, urlParser } from '../core/utils/fetch'
import { useError } from '../core/state/error'

${importConcept}

/**
 *
 */
export async function ${name} (data: Dynamic): Promise<${conceptUpperCase}> {
  const { addError } = useError()

  const url = urlParser('${url}', data)

  try {
    // TODO Hydrate?
    // TODO validation?
    return fetch('${method}', url, data)
  } catch (e) {
    addError(\`Could not complete fetch of \${url}\`)
    console.error(e.error)
  }
}
`

/**
 *
 */
exports.generateEndpoint = async function (name, { concept, method, url, fields = []}, dryRun = false) {
  const { lowerCase, upperCase } = toCamelCaseVariants(concept)

  const importConcept = concept
    ? `import { ${upperCase} } from '../concepts/${lowerCase}'`
    : ''

  const endpoint = getEndpoint(name, importConcept, upperCase, method, url, fields)

  if (dryRun === false) {
    await modifyFile('../endpoints/register.ts', [
      '  // (-->) Register endpoints here'
    ], `?`)

    await writeFile(`../endpoints/${lowerCase}.ts`, endpoint, 'utf-8') 
  }

  return endpoint
}