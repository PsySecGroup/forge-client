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

## Research

* Make `core` an npm/git/importale module 
* Create an app generator as a separate repo