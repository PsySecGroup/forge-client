import { createContext } from 'solid-js'
import { defineStore } from '../../state/store'

const defaultState = {
  id: 1,
  // primitives: [1, 2, 3],
  // objects: [
  //   { name: 'alice'},
  //   { name: 'bob'},
  //   { name: 'carol'}
  // ],
  // metadata: {
  //   date: new Date('2024-01-01'),
  //   author: 'Me'
  // }
}

export type ComplexState = typeof defaultState

export const getComplexStore = (state = defaultState) => defineStore(state, () => ({
  test: () => undefined
}))

export const complexContext = createContext(defaultState)
