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
| `PROJECT_NAME` | The name of your project used in metadata (title, OG tags, etc.). | `My App` |
| `PROJECT_DESCRIPTION` |	A brief description used in meta tags and page title. | `Fast and lightweight PWA` |
| `PROJECT_TITLE` |	The final HTML <title> value. Falls back to PROJECT_NAME if empty. | `My App` |
| `PROJECT_URL` |	The canonical URL of the deployed project, used in OG tags and CSP.	| `https://myapp.com` |
| `ASSET_PATH` | Base path for static assets (e.g. favicons, images). Should end with /. | `/assets/` |
| `PROJECT_CSP` |	Custom directives appended to the Content Security Policy header. Requires 'self' and trusted sources. | `img-src 'self' https://cdn.myapp.com;` |
| `PROJECT_PRECONNECTS` |	Comma-separated list of external domains to preconnect for performance. | `https://fonts.googleapis.com,https://cdn.myapp.com` |
| `PROJECT_SERVICE_WORKERS` |	Comma-separated list of service worker script paths to register in production. These scripts must have unique scopes. | `/sw-cache.js,/sw-sync.js` |

## Research

* Make `core` an npm/git/importale module 
* Create an app generator as a separate repo
* Confirm the `fileUpload` component works
* Architectural Designs
  * `dist`
    * [ ] 
  * `src/assets`
    * [ ] 
  * `src/components`
    * [ ] 
  * `src/core`
    * [ ] 
  * `src/domains`
    * [ ] 
  * `src/layouts`
    * [ ] 
  * `src/pages`
    * [ ] 
  * `.env`
    * [ ] 
  * `index.html`
    * [ ] Move `#viewport` to a general CSS file
  * Development
    * `vite.config.ts`
      * [ ] 