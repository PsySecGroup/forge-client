// Core Types
export type RecordKey = string | number | symbol
export type Primitive = string | number | boolean | null | Date | RegExp | bigint | symbol | undefined
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
export type HttpMethods = 'post' | 'get' | 'put' | 'delete' | 'patch' | 'option' | 'head'
export type BasicRecord = Record<RecordKey, unknown>

// Common Types
export type Dictionary<T> = { [key: string]: T }
export type AsyncResult<T> = T | Promise<T>
export type Maybe<T> = T | undefined
export type NonNullable<T> = T extends null | undefined ? never : T
export type JsonValue = string | number | boolean | JSONObject | JSONArray
export type JSONObject = { [key: string]: JsonValue }
export type JSONArray = JsonValue[]
export type Response<T> = { status: number; data: T }
export type Pagination<T> = { total: number; items: T[]; currentPage: number; totalPages: number }

// Optional and Required Type Modifiers
export type Optional<T> = T | undefined

// Makes all properties required
export type Required<T> = { [K in keyof T]-?: T[K] }  

// Date and Time
export type Timestamp = number
export type DateString = string
export type TimeString = string
export type Timezone = string

// Key-Value pair types
export type KeyValue<T = string> = { [key: string]: T }

// File-related types
export type FilePath = string
export type File = Blob
export type FileUpload = { file: File; name: string; size: number }

// Utility types
export type ExtractPromise<T> = T extends Promise<infer U> ? U : never
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T
export type OmitUndefined<T> = T extends undefined ? never : T
export type Enriched<T> = T & { createdAt: Date; updatedAt: Date; }

// Object manipulation types
export type Merge<A, B> = A & B

// Additional Utility Types

// For handling promise resolve types
export type Awaited<T> = T extends Promise<infer U> ? U : T 

// Extracts types that are assignable to another type
export type ExtractType<T, U> = T extends U ? T : never

// Filters out types from a union type
export type FilterOut<T, U> = T extends U ? never : T

// Recursively makes an object type read-only
export type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> }

// More Object Manipulation Types

// Extracts keys with a specific value type
export type PickByValue<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T]

// Event and DOM-related Types

// A type for event listeners
export type EventListener<T extends Event = Event> = (event: T) => void

// Maps event types to their respective event
export type EventMap = { [K in string]: Event }

// Common DOM events
export type ChangeEvent<T = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = Event & { target: T }

export type DOMEvent = MouseEvent | KeyboardEvent | FocusEvent | ChangeEvent

// Type for a click event handler
export type ClickEventHandler = (event: MouseEvent) => void

// Type for a focus event handler
export type FocusEventHandler = (event: FocusEvent) => void

// Type for an input event handler
export type InputEventHandler = (event: InputEvent) => void

// HTTP/Network Types

// Type for HTTP headers
export type HTTPHeaders = { [key: string]: string | string[] }

// Type for fetch API options (extends RequestInit)
export type FetchOptions = RequestInit

// Custom response for fetch data
export type FetchResponse<T> = { data: T; status: number }

// Redux-like types

// Base type for an action
export type Action<T = string> = { type: T }

// A type for Redux-style reducers
export type Reducer<S, A> = (state: S, action: A) => S

// Dispatch function type
export type Dispatch<A> = (action: A) => void

// State and Memoization Types

// State update function type
export type StateUpdater<T> = (newState: T) => void

// Type for memoized values
export type MemoizedValue<T> = { value: T }

// Return type of a state hook (e.g., React-like)
export type UseStateReturn<T> = [T, StateUpdater<T>]

// Server-side types
export type HttpRequest = { body: string; params: Record<string, string>; headers: Record<string, string> }
export type HttpResponse = { statusCode: number; body: string; headers: Record<string, string> }

// Miscellaneous Types
export type Timeout = ReturnType<typeof setTimeout>
export type Interval = ReturnType<typeof setInterval>

// Type for async iterators
export type AsyncIterator<T> = { next: () => Promise<IteratorResult<T>> }

// Miscellaneous Type Helpers
// Check if a type is `never`
export type IsNever<T> = [T] extends [never] ? true : false

// Check if a type is `any`
export type IsAny<T> = 0 extends (1 & T) ? true : false

// Check if a type is `unknown`
export type IsUnknown<T> = unknown extends T ? true : false
