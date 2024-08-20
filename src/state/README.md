The beating heart of this thing

Let's make it simple:

. Define a type and a default hydration method in a new `types` file

```ts
// types/ui.ts

import type { type SetStoreFunction } from 'solid-js/store'
import { NOOP } from '../constants'
import type { Themes } from '../themes'
import type { Json } from './common'
import { hydrateJson } from './json'

export type Ui = {
  theme: Themes
}

type Concept = Ui

const defaultValues: Concept = {
  theme: 'mainLight'
}

export const hydrate = (json: string | Concept | Json = {}): Concept => {
  return hydrateJson<Concept>(json, defaultValues)
}

export type StoreState = {
  ui: Concept
  setUi: SetStoreFunction<Concept>
}

export const defaultState: StoreState = {
  ui: hydrate(),
  setUi: NOOP
}

```

. Register defaults

```ts
// types/register.ts

import { defaultState as uiDefaults } from './ui'

export default {
  // (-->) Add new types here
  ...uiDefaults
}
```

3. Register the Store State

```ts
// state/register.ts

import type { SetStoreFunction } from 'solid-js/store'
import type { Values } from '../types/values'
import type { StoreState as UiStoreState} from '../types/ui'

export type StoreState = {
  values: Values
  setValues:  SetStoreFunction<Values>  
  //  (-->) Register store states here
} & UiStoreState

```

4. Create actions that modify the type

```ts
// actions/ui.ts

export default {
  /**
   *
   */
  closeEverything: ({ setValues }) => {
    return setValues({
      closeEverything: true
    })
  }
}
````

5. Register the actions

```ts
// actions/register.ts

// (-->) Add new action files here
import Ui from './ui'

export default {
  // (-->) Spread exported Actions here
  ...Ui
}
````

6. Attach it to either a Persising Store or a Temporary Store

```ts
// state/stores.ts

import { type Ui } from '../types/ui'
import { createLocalStore } from './localStore'
import { createStore, type SetStoreFunction } from 'solid-js/store'
import { type Values } from '../types/values'
import { defaults } from './defaults'

type Stores = {
  // (-->) Add persisting data here
  ui: Ui
  setUi: SetStoreFunction<Ui>

  // (-->) Add temporary data here
  values: Values
  setValues: SetStoreFunction<Values>
}

export function getStores (): Stores {
  // (-->) Add persisting data here
  const [ui, setUi] = createLocalStore<Ui>('ui', defaults.ui)

  // (-->) Add temporary data here
  const [values, setValues] = createStore<Values>(defaults.values)

  return {
    // (-->) Add persisting data here
    ui,
    setUi,

    // (-->) Add temporary data here
    values,
    setValues
  }
}
```
