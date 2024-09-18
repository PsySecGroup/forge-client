import * as Yup from 'yup'
import { parseISO } from 'date-fns'

// Define the type for the configuration schema
type SchemaConfig = {
  [key: string]: {
    type: 'string' | 'number' | 'date' | 'object' | 'array'
    required?: boolean
    matches?: string
    email?: boolean
    url?: boolean
    uuid?: boolean
    positive?: boolean
    integer?: boolean
    oneOf?: (string | number | date | boolean)[]
    notOneOf?: (string | number | date | boolean)[]
    min?: number
    max?: number
    datetime?: boolean
    nullable?: boolean
    nonNullable?: boolean
    shape?: SchemaConfig  // For nested objects
    items?: SchemaConfig  // For array items
  }
}

/**
 * Function to convert JSON configuration to Yup schema
 */
export function getValidationSchema(config: SchemaConfig, returnShape: boolean = false): Yup.ObjectSchema {
  const shape: { [key: string]: Yup.BaseSchema } = {};
  let isArrayOnly = false

  for (const [key, rules] of Object.entries(config)) {
    let yupSchema: Yup.BaseSchema;

    isArrayOnly = key === '__array'

    switch (rules.type) {
      case 'string':
        yupSchema = Yup.string()
        if (rules.min) yupSchema = yupSchema.min(rules.min, `${key} must be longer than ${rules.min} characters long`)
        if (rules.max) yupSchema = yupSchema.max(rules.max, `${key} cannot be longer than ${rules.max} characters long`)
        if (rules.matches) yupSchema = yupSchema.matches(new RegExp(rules.matches), `${key} does not match expectations`)
        if (rules.email) yupSchema = yupSchema.email(`${key} is not a valid e-mail address`)
        if (rules.url) yupSchema = yupSchema.url(`${key} is not a valid URL`)
        if (rules.uuid) yupSchema = yupSchema.uuid(`${key} is not a valid UUID`)
        break
      case 'number':
        yupSchema = Yup.number()
        if (rules.positive) yupSchema = yupSchema.positive(`${key} must be positive`)
        if (rules.integer) yupSchema = yupSchema.integer(`${key} must be negative`)
        if (rules.min) yupSchema = yupSchema.min(rules.min, `${key} cannot be lesser than ${rules.min}`)
        if (rules.max) yupSchema = yupSchema.max(rules.max, `${key} cannot be greater than ${rules.max}`)
        break
      case 'date':
        yupSchema = Yup.date()
        if (rules.datetime) yupSchema = yupSchema.typeError(`${key} must be a valid date`)
        
        break
      case 'object':
        yupSchema = rules.shape
          ? Yup.object().shape(getValidationSchema(rules.shape || {}, true).schema)
          : Yup.object()
        break
      case 'array':
        yupSchema = rules.items
          ? Yup.array().of(getValidationSchema({ __array: rules.items } || {}).schema)
          : Yup.array()
        break
      default:
        throw new Error(`Unsupported type for ${key}: ${rules.type}`)
    }

    if (rules.oneOf) yupSchema = yupSchema.oneOf(rules.oneOf)
    if (rules.notOneOf) yupSchema = yupSchema.notOneOf(rules.notOneOf)
    if (rules.default) yupSchema = yupSchema.default(rules.default)
    if (rules.required) yupSchema = yupSchema.required(`${key} is required`)
    if (rules.nullable) yupSchema = yupSchema.nullable()
    if (rules.nonNullable) yupSchema = yupSchema.required(`${key} is required`)

    shape[key] = yupSchema
  }

  const schema = isArrayOnly === true
    ? shape.__array
    : returnShape === true
      ? shape
      : Yup.object().shape(shape)

  return {
    schema,
    validate: async data => {
      let validated = false, error = false

      try {
        validated = await schema.validate(data)
      } catch (e) {
        error = e
      }

      return {
        validated,
        error
      }
    }
  }
}
