# Forge Client

This is a frontend project template using [SolidJS](https://solidjs.com).  We offer:

* Simple state management for both persisting (via `localStorage`) and temporary stores
* Simple state management for both persistent (via 1localStorage1) and temporary stores
  * [Concepts](src/concepts) as units of state
  * [Actions](src/actions) as state mutators
  * A simple way to [register concepts](src/state/register.ts) with state management
* Simple [Material-UI integration](https://suid.io/) and [theme management](src/themes)
* Environment variable controls over common HTML needs (OpenGraph, meta tags, etc.)
* [Pages](src/pages)/[Component](src/components) code organization for reusable visual elements

## Installation

Instructions pending!

## Development

This is an opinionated framework designed to use the benefits of SolidJs with minimal complexity.

### Concepts

* Concepts are units of state. They are composed into the overall application state management.
* Concepts are assumed to be JSON-first, meaning we assume typeless JSON is the default transport methodology for API interaction. This allows us to simplify reasoning about state because we only need to use `.toJSON` to prepare state for API requests and `hydrate` when dealing with API responses.
* Concepts are _always_ plain objects.
* Concepts are either persistent (the values are restored upon application restart) or temporary (the values are reset to their default values upon application restart).
* Concepts are mutated through Actions.
* Concepts have a **unique name**.
* Concepts have a **store state**: a type signature for how their getter and setter are represented in state management.
* Concepts have a **default value**: the value the state will be in when the application starts.
* Concepts have a **hydration method**: a method that converts the state from JSON to a Concept state management can handle. Complex concepts (like arrays and objects) that have other Concepts within them will utilize that Concept's hydration method as well.
* Concepts have a **default state**: a shape for how their getter and setter are initially defined.
* Concepts have a **store retrieval**: a method that pulls the state from either a persistent store or a temporary store and returns a composable unit of state for state management.

Example for a `Ui` concept that is persistently stored:

```ts
import type { SetStoreFunction } from 'solid-js/store'
import type { Themes } from '../themes'
import type { Json } from '../core/types'
import { NOOP } from '../constants'
import { persistingStore, hydrateJson } from '../core'

// Unique Name
export type Ui = {
  theme: Themes
}

// Boilerplate helper
type Concept = Ui

// Store State
export type StoreState = {
  ui: Concept
  setUi: SetStoreFunction<Concept>
}

// Default Values
const defaultValues: Concept = {
  theme: 'mainLight'
}

// Hydration Method
export const hydrate = (json: string | Concept | Json = {}): Concept => {
  return hydrateJson<Concept>(json, defaultValues)
}

// Default State
export const defaultState: StoreState = {
  ui: hydrate(),
  setUi: NOOP
}

// Store Retreival
export const getStore = (): StoreState => {
  const [ui, setUi] = persistingStore<Concept>('ui', defaultValues)

  return {
    ui,
    setUi
  }
}
````

Concepts must be registered.  Registration cues look like `// (-->)` and tell you where to perform the registration.  Concepts must be registered in the following places:

* [Concept registration](src/concepts/register.ts)
* [State registration](src/state/register.ts)

#### Values Concept

The Values concept is a default Concept that comes with each project.  It is a dedicated temporary store.  You can add new primitives to track in the Values concept in the following places:

* [Values Type](src/concepts/values.ts:8)
* [Default Values](src/concepts/values.ts:20)
* [Values Hydration](src/concepts/values.ts:30)

### Actions

Actions allow you to easily modify states from any component.  All actions are automatically attached to the result of `useStoreContext()`.  For sanity reasons, it is best to name your action file after the Concept you are modifying.

* [`src/actions`](src/actions): Directory where Action domains go
* [`src/actions/ui.ts`](src/actions/ui.ts): Example of UI actions.  Each action takes the complete application state as a parameter, which will contain the getters and setters from each Concept's `getStore`.

### Pages

A Page contains components.

* [`src/pages`](src/pages): Pages should be added here
* [`src/pages/template.tsx`](src/pages/template.tsx): This is an example of a Page
* [`src/App.tsx`](src/App.tsx:42): Pages should be added to the App component's as a child of `ThemesProvider/Box`

### Components

* [`src/components`](src/components): Thos contains complex components that often extend from core components.  These rely on `getStoreContext` when you want to incorporate state.
* [`src/components/css`](src/components/css): These contain the CSS files for complex components

### Themes

All themes are in the [`src/themes`](src/themes) folder.

### Assets

Static assets are in the [`src/assets`](src/assets) folder.

## Testing

You can check out file sizes and load times of individual files in dev by visiting [http://localhost:3000/__inspect](http://localhost:3000/__inspect)

## Usage

* `npm run dev`: Starts development mode
* `npm run build`: Builds a standalone application
* `npm run compile`: Performs a test, lint, and a build
* `npm run lint`: Checks for sytnax errors
* `npm run preview`: TBD

## Research

* [Nifty array tricks](https://www.youtube.com/watch?v=hdUwDmprSmg)
* [State flexibility](https://www.youtube.com/watch?v=8cAEk4mH3pk)
* [Setup testing](https://docs.solidjs.com/guides/testing)
* [`src/utils/fetch.ts`](src/utils/fetch.ts)
  * Change `testResult` in `fetch()` to an `axios` mock instead
  * Look into `import { HardenedFetch } from 'hardened-fetch'`
* [`src/state/localStore.ts`](src/state/localStore.ts)
  * Turn on `localStorage`
* [`index.html`](index.html)
  * Figure out `service-worker`
  * Figure out `manifest.json`
  * Populate `apple-touch-icon.png`
  * Populate `favicon-32x32.png`
  * Populate `favicon-16x16.png`