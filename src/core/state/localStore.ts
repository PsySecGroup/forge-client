import type { BasicRecord } from '../types/basic';
import { type SetStoreFunction, createStore } from 'solid-js/store';
import { createEffect, createRoot } from 'solid-js';

/**
 * Creates a SolidJS store that synchronizes with localStorage.
 * @param storeName The key to be used in localStorage.
 * @param initialState The initial state for the store if no value exists in localStorage.
 * @returns A tuple containing the store state and a setter function.
 */
export function createLocalStore<T extends BasicRecord>(
  storeName: string,
  initialState: T
): [T, SetStoreFunction<T>] {
  let store: [T, SetStoreFunction<T>] | undefined;

  // Initialize the store within the root scope
  createRoot(() => {
    // Try to get the stored state from localStorage, or use the initial state
    const savedState = localStorage.getItem(storeName);
    const parsedState = savedState ? JSON.parse(savedState) : initialState;

    // Create the store using the parsed state
    store = createStore<T>(parsedState);

    // Synchronize changes to localStorage when state changes
    createEffect(() => {
      if (store) {
        localStorage.setItem(storeName, JSON.stringify(store[0]));
      }
    });
  });

  // Ensure the store has been initialized before returning
  if (!store) {
    throw new Error("Store has not been initialized yet.");
  }

  return store;
}


// // TODO reallocate this
// import { type SetStoreFunction, createStore, reconcile } from 'solid-js/store'
// import type { RecordKey, BasicRecord } from '../types/basic'

// type Primitive = string | number | boolean | symbol | null | undefined | bigint
// type NonArrayObject = Exclude<object, unknown[]>
// type Actions<T> = (store: T, setStore: SetStoreFunction<T>) => Record<RecordKey, () => void>

// /**
//  * Returns a storeW
//  */

// export function defineStore<T extends BasicRecord>(
//   defaultState: T,
//   getDefaultActions?: Actions<T>
// ) {
//   const [store, setStore] = createStore<T>(defaultState)

//   const defaultActions = getDefaultActions === undefined
//     ? {}
//     : getDefaultActions(store, setStore)

//     const actions = {
//     ...defaultActions,

//     /**
//      * Updates a primitive property with a new value
//      */
//     update: (
//       propertyName: keyof T, 
//       value: T[typeof propertyName] & (Primitive | NonArrayObject)
//     ) =>{
//       if (value as NonArrayObject instanceof Object) {
//       // @ts-expect-error: Trust me bro
//         setStore(propertyName, {
//           ...value as object,
//           ...store[propertyName] as object
//         })
//       } else {
//         // @ts-expect-error: Trust me bro
//         setStore(propertyName, value)
//       }
//     },

//     /**
//      * The properties of the existing object will be combined with the properties of the "new" object you are setting, 
//      * updating any overlapping properties with the values from the new object
//      */
//     updateAt: (
//       arrayName: keyof T,
//       position: number,
//       item: T[typeof arrayName] extends (infer U)[] ? U & (Primitive | NonArrayObject) : never
//       // item: T[typeof arrayName][number] & (Primitive | NonArrayObject)
//     ) => {
//       // @ts-expect-error: Trust me bro
//       setStore(arrayName, position, item)
//     },

//     /**
//      * Appends an element to an array property
//      */
//     append: (
//       arrayName: keyof T,
//       item: T[typeof arrayName] & (Primitive | NonArrayObject)
//     ) => {
//       // @ts-expect-error: Trust me bro
//       setStore(arrayName, [...store[arrayName], item])
//     },

//     /**
//      * Target a subset of elemen's property to update or modify by specifying a range of indices
//      */
//     reviseAt: (
//       arrayName: keyof T,
//       range: number[],
//       propertyName: keyof T[typeof arrayName],
//       value: (T[typeof arrayName][typeof propertyName] & (Primitive | NonArrayObject)) | ((e: T[typeof arrayName][typeof propertyName]) => typeof e)
//     ) => {
//       // @ts-expect-error: Trust me bro
//       setStore(arrayName, range, propertyName, value)
//     },

//     /**
//      * Filter which object elements to update a specific property of
//      */
//     reviseOn: (
//       arrayName: keyof T, 
//       filter: (e: T[typeof arrayName]) => boolean,
//       propertyName: keyof T[typeof arrayName],  // propertyName should be a key of the array item type
//       value: T[typeof arrayName][typeof propertyName]  // value is of the type of the property in the array item
//     ) => {
//       // @ts-expect-error: Trust me bro
//       setStore(arrayName, filter, propertyName, value);
//     },

//     /**
//      * Merges two arrays together and updates it based on the difference
//      */
//     reconcile: (
//       arrayName: keyof T,
//       array: T[typeof arrayName][]
//     ) => {
//       // @ts-expect-error: Trust me bro
//       setStore(arrayName, reconcile(array))
//     }
//   }

//   return {
//     store,
//     actions
//   }
// }
