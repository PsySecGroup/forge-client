# Forge Client

This is a frontend project template using [SolidJS](https://solidjs.com).  We offer:

* Simple [store-centric](https://docs.solidjs.com/concepts/stores) state management for both [persistant](src/core/tests/exampleApp/formsState.tsx) (via `localStorage`) and temporary stores.
* Simple [theme management](src/tests/theming.test.tsx)
* [Environment variable controls over common HTML needs](index.html) (OpenGraph, meta tags, etc.)
* Simplified [navigation features](src/core/tests/navigation.test.tsx)
* Simplified [notification features](src/core/tests/notifications.test.tsx)
* Simplified [console features](src/core/tests/console.test.tsx)

## Installation

Instructions pending!  Hang tight!

## Development

This is an opinionated framework designed to use the benefits of SolidJs with minimal complexity.

### State

State management is the most important part of a decent reactive frontend framework.

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

### .env Variables

We have three `.env` files:

* `.env.common`: Variables defined here will appear in all environments.
* `.env.development`: Variables defined here will only appear in development environments.  They can override variables by the same name in `.env.common`
* `.env.production`: Variables defined here will only appear in production environments.  They can override variables by the same name in `.env.common`

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `PROJECT_NAME` | The name of your project used in metadata.  This value will appear in the browser title/bookmark name. | `My App` |
| `PROJECT_DESCRIPTION` |	A brief description used in meta tags and page title. If set, it will be appended to the browser title/bookmark name. | `Fast and lightweight PWA` |
| `PROJECT_URL` |	The canonical URL of the deployed project, used in OG tags and CSP.	| `https://myapp.com` |
| `ASSET_PATH` | Base path for static assets (e.g. favicons, images). Should end with `/`. | `/assets/` |
| `PROJECT_CSP` |	Custom directives appended to the Content Security Policy header. Requires `'self'` and trusted sources. | `img-src 'self' https://cdn.myapp.com;` |
| `PROJECT_PRECONNECTS` |	Comma-separated list of external domains to preconnect for performance. | `https://fonts.googleapis.com,https://cdn.myapp.com` |
| `PROJECT_SERVICE_WORKERS` |	Comma-separated list of service worker script paths to register in production. These scripts must have unique scopes. | `/sw-cache.js,/sw-sync.js` |

## Research

* Create an app generator as a separate repo
* Architectural Designs
  * `dist`
    * [?] Confirm `android` builds work
    * [?] Confirm `ios` builds work
    * [?] Confirm `desktop` builds work
    * [?] Figure out why `standalone.html` does not like the Navigation store
  * `src/assets`
    * [?] Fix Subresource Integrity (SRI) hash generation in `build/sri.ts`
    * [?] Fix watermarking in `build/watermark.ts`
  * `src/core`
    * [ ] Make `core` an npm/git/importale module
    * [ ] Take the `tests` folder in here and bring it into the main project
      * [ ] Utilize `vitest` instead of `uvu`
    * [ ] Make a `forge-test` package that uses `vitest` and the contents in `src/core/tests/utils.ts` as fundamentals
  * `index.html`
    * [ ] Move `#viewport` to a general CSS file
  * Development
    * [ ] Make a TUI
  * `src/layouts`
    * [ ] Standardize CSS and themes into something easier to reason about
    * [ ] Standardize grid layouts for easily composition
    * [ ] Make sure all layouts work in mobile AND desktop
  * `src/components`
    * [ ] Test `fileUpload`
    * [ ] Continue to build examples until we land on a robust store pattern
      * [ ] Then build it
    * [ ] Find common patterns in `TSX` expression
  * `src/domains`
    * [ ] Figure out how best to populate, persist, and refresh a domainStore with from third-parties like APIs

Diagram:
```
   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
   │ API Fetcher │ ─────▶ │ domainStore │ ─────▶ │ UI/Form use │
   └─────────────┘        └─────────────┘        └─────────────┘
                                 ▲                      │
                                 │                      ▼
                      ┌────────────────────┐     ┌────────────┐
                      │ formStore.set(...) │ ◀── │ initialize │
                      └────────────────────┘     └────────────┘
```

Example store:
```ts
import { createStore } from 'solid-js/store'

type Domain<T = any> = {
  data: T
  fetchedAt: number
  stale: boolean
}

type DomainStoreType = {
  users: Record<string, Domain>
  products: Record<string, Domain>
  posts: Record<string, Domain>
}

const [domainState, setDomainState] = createStore<DomainStoreType>({
  users: {},
  products: {},
  posts: {}
})

function isStale(fetchedAt: number, ttl = 5 * 60 * 1000): boolean {
  return Date.now() - fetchedAt > ttl
}

function markUserStale(userId: string) {
  setDataState('users', userId, 'stale', true)
}
```

Fetch example:
```ts
export async function fetchUser(userId: string, forceRefresh = false) {
  const existing = dataState.users[userId]

  if (existing && !forceRefresh && !isStale(existing.fetchedAt)) {
    return existing.data
  }

  const res = await fetch(`/api/users/${userId}`)
  const data = await res.json()

  setDataState('users', userId, {
    data,
    fetchedAt: Date.now(),
    stale: false
  })

  return data
}
```

With component initialization:
```tsx
onMount(() => {
  fetchUser(userId) // Will auto-refresh if stale
    .then(data => {
      initializeForm('userForm', data)
    })
})

createEffect(() => {
  const userMeta = dataState.users[userId]
  if (!userMeta || isStale(userMeta.fetchedAt)) {
    fetchUser(userId)
  }
})
```
  * `src/pages`
    * [ ] Find a common pattern somehow
