// These are the type definitions needed for the build system

export {}

declare global {
  interface Window {
    __NEUJS__?: boolean
  }
}
