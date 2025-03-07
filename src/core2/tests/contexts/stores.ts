import { registerContext } from '../../state/context'

const defaults = {
  id: 1,
  primitives: [1, 2, 3],
  objects: [
    { name: 'alice'},
    { name: 'bob'},
    { name: 'carol'}
  ],
  metadata: {
    date: new Date('2024-01-01'),
    author: 'Me'
  }
}

export const storesContext = registerContext('stores', defaults)
