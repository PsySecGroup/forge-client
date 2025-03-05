import type { JSX } from 'solid-js/jsx-runtime'

export type RecordKey = string | number | symbol

export type Primitive = string | number | boolean | null | Date | RegExp | bigint | symbol | undefined
export type PrimitiveMap = Map<Primitive, Primitive>
export type PrimitiveSet = Set<Primitive>
export type PrimitiveRecord = Record<RecordKey, Primitive>
export type PrimitiveCollection = PrimitiveMap | PrimitiveSet | PrimitiveRecord

export type Dynamic = Primitive
  | PrimitiveCollection
  | DynamicFunction
  | Dynamic[]

export type DynamicMap = Map<Primitive, Dynamic>
export type DynamicSet = Set<Dynamic>
export type DynamicFunction = ((...args: Any[]) => Any)
export type DynamicRecord = Record<RecordKey, Dynamic>
export type DynamicCollection = DynamicMap | DynamicSet | DynamicRecord

export type Any = Dynamic | DynamicCollection | Any[]

// Makes all properties optional
export type Optional<T> = {
  [K in keyof T]?: T[K]
}

// Exclude properties from an object: Omit<Person, "address" | "age">
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Constructs a type in a piecemeal manner: Pick<Person, "name" | "age">
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

export type ID = number
export type GUID = string
export type Email = string
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type EventHandler = (event: Event) => void
export type Callback<T> = (data: T) => void
export type Nullable<T> = T | null
export type HexColor = string
export type Float = number
export type Integer = number
export type ResourcePath = string
export type Query = string
export type HttpMethods = 'post' | 'get' | 'put' | 'delete'
export type Key = string | number | symbol

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
}

export type FormData = Record<string, string | number | boolean>

export type ApiRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  headers?: Record<string, string>
  data?: Dynamic
}

export type DateRange = {
  startDate: Date
  endDate: Date
}

export type KeyDownEvent = KeyboardEvent & { currentTarget: HTMLInputElement, target: Element }
export type ClickEvent = MouseEvent & { currentTarget: HTMLDivElement, target: Element }

export type Style = JSX.CSSProperties
export type Class = string | string[] | { [key: string]: boolean }