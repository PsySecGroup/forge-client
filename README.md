# Forge Client

This is a frontend project template using [SolidJS](https://solidjs.com).

## Installation

```bash
npm install # or pnpm install or yarn install
```

## Development

### State

We centralize state as much as possible.  We also track it automatically and rehydrate it from `localStorage`  To benefit from all of this, do the following:

#### Adding A Data Domain

* [`src/state/types.ts`](src/state/types.ts): This is the type signature of the centralized state shape.
* [`src/state/defaults.ts`](src/state/defaults.ts): This contains the shape of the centralized state.
* [`src/state/stores.ts`](src/state/stores.ts): This contains how centralized data breaks down into persisting data and temporary data.
* [`src/types`](src/types): This directory contains types that reflect data domains
  * [`src/types/example.ts`](src/types/example.ts): This is a large eaxmple of a data domain.  Take note of the usage of the hydration featuers made possible by `src/types/json.ts`
* [`src/state/index.tsx`](src/state/index.tsx): This allows you to add centralized state modifiers to the store context, allowing application-wide access to centralized state modification

#### Adding A Simple Primitive

* [`src/types/values.ts`](src/types/values.ts): This contains a list of simple primitives that are part of the temporary centralized state.

### Actions

Actions allow you to easily modify states from any component.  All actions are automatically attached to the result of `useStoreContext()`.  For sanity reasons, it is best to name your action after the store value you are modifying.

* [`src/actions`](src/actions): Directory where Action domains go
  * [`src/actions/ui.ts`](src/actions/ui.ts): Example of UI actions.  Each action takes `stores` as a parameter
* [`src/state/index.ts`](src/state/index.ts): Where actions are automatically attached to the Store Context
* [`src/actions/index.ts`](src/actions/index.ts): Action domains are attached to the Action cluster here

### Themes

All themes are in the [`src/themes`](src/themes) folder

### Assets

Static assets are in the [`src/assets`](src/assets) folder

### Components

* [`src/components/base`](src/components/base): This contains common components that are used to extend more complex components.  Typically, these accept props.
* [`src/components`](src/components): Thos contains complex components that often extend from base components.  Typically, these rely on store context.
* [`src/components/css`](src/components/css): These contain the CSS files for complex components

### Pages

A Page contains components.

* [`src/pages`](src/pages): Pages should be added here
  * [`src/pages/template.tsx`](src/pages/template.tsx): This is an example of a Page
* [`src/App.tsx`](App.tsx): Pages should be added to the App component's as a child of ThemesProvider/Box

## Testing

You can check out file sizes and load times of individual files in dev by visiting [http://localhost:3000/__inspect](http://localhost:3000/__inspect)

## Usage

* `npm run dev`: 
* `npm run build`: 
* `npm run compile`: 
* `npm run lint`: 
* `npm run preview`: 

## Research

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