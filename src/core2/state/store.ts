import { createStore, reconcile } from 'solid-js/store'

export type RecordKey = string | number | symbol
type Primitive = string | number | boolean | symbol | null | undefined | bigint
type NonArrayObject = Exclude<object, any[]>;

/**
 * Returns a store
 */
export function getStore<T extends Record<RecordKey, any>>(values: T) {
  const [store, setStore] = createStore<T>(values)

  const actions = {
    /**
     * Updates a primitive property with a new value
     */
    update: (propertyName: keyof T, value: T[typeof propertyName] & (Primitive | NonArrayObject)) =>{
      if (value as NonArrayObject instanceof Object) {
      // @ts-ignore: Trust me bro
        setStore(propertyName, {
          ...value,
          ...store[propertyName]
        })
      } else {
        // @ts-ignore: Trust me bro
        setStore(propertyName, value)
      }
    },

    /**
     * The properties of the existing object will be combined with the properties of the "new" object you are setting, 
     * updating any overlapping properties with the values from the new object
     */
    updateAt: (arrayName: keyof T, position: number, item: T[typeof arrayName][number] & (Primitive | NonArrayObject)) => {
      // @ts-ignore: Trust me bro
      setStore(arrayName, position, item)
    },

    /**
     * Appends an element to an array property
     */
    append: (arrayName: keyof T, item: T[typeof arrayName] & (Primitive | NonArrayObject)) => {
      // @ts-ignore: Trust me bro
      setStore(arrayName, [...store[arrayName], item])
    },

    /**
     * Target a subset of elemen's property to update or modify by specifying a range of indices
     */
    reviseAt: (arrayName: keyof T, range: number[], propertyName: T[typeof arrayName], value: (T[typeof propertyName] & (Primitive | NonArrayObject)) | ((e: T[typeof arrayName][typeof propertyName]) => any)) => {
      // @ts-ignore: Trust me bro
      setStore(arrayName, range, propertyName, value)
    },

    /**
     * Filter which object elements to update a specific property of
     */
    reviseOn: (arrayName: keyof T, filter: (e: T[typeof arrayName]) => boolean, propertyName: T[typeof arrayName], value: T[typeof arrayName][typeof propertyName]) => {
      // @ts-ignore: Trust me bro
      setStore(arrayName, filter, propertyName, value)
    },

    /**
     * Merges two arrays together and updates it based on the difference
     */
    reconcile: (arrayName: keyof T, array: T[typeof arrayName][]) => {
      // @ts-ignore: Trust me bro
      setStore(arrayName, reconcile(array))
    }
  }

  return [store, setStore, actions]
}
