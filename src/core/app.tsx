// Apply base CSS resets globally across the application
import './themes/reset.css'

// SolidJS types
import { type ParentProps, type JSX, Component } from 'solid-js'

// Console state and context utilities
import { ConsoleCommand, ConsoleProvider, getConsoleActions } from '../components/console/store'

// Other global state providers
import { NavigationProvider } from '../components/navButton/store'
import { NotificationsProvider } from '../components/notifications/store'

// Theme provider for styling and UI theming
import { ThemeProvider } from './themes/index'

// Global developer console UI component
import Console from '../components/console'

/**
 * Type alias for a dynamic context provider component.
 * Each provider must accept `children` via Solid's ParentProps.
 */
type DynamicProvider = Component<ParentProps>

/**
 * Props for the `ForgeApp` component.
 *
 * @property consoleCommands - Optional list of console commands to pre-register.
 * @property providers - Optional list of additional provider components to wrap around the app.
 * @property children - The main application content to be rendered within the provider hierarchy.
 */
type Props = ParentProps<{
  consoleCommands?: ConsoleCommand[]
  providers?: DynamicProvider[]
}>

/**
 * `ForgeApp` is the root-level component responsible for bootstrapping
 * global state providers, theme configuration, and developer tools (console).
 *
 * It supports dynamic injection of context providers at runtime, making it highly
 * extensible for plugin systems, feature toggles, or environment-specific wrappers.
 *
 * @param children - App content to render inside the providers.
 * @param consoleCommands - Commands to initialize in the developer console.
 * @param providers - Optional dynamically-injected providers for runtime extensibility.
 * @returns A JSX element tree with all providers nested and initialized.
 */
export const ForgeApp = ({
  children,
  consoleCommands = [],
  providers = []
}: Props): JSX.Element => {
  // Access the console store actions using the SolidJS context
  const { setCommands } = getConsoleActions()

  // Pre-register any custom console commands if provided
  if (consoleCommands.length > 0) {
    setCommands(consoleCommands)
  }

  /**
   * Static list of core providers used throughout the app.
   * These are always applied in this specific nesting order:
   * 
   * - ConsoleProvider: Manages internal dev tools and command interface.
   * - NavigationProvider: Tracks and controls current navigation state.
   * - NotificationsProvider: Global pub-sub system for toast/alerts.
   * - ThemeProvider: Applies theming (e.g., dark/light mode, tokens).
   */
  const staticProviders = [
    ConsoleProvider,
    NavigationProvider,
    NotificationsProvider,
    ThemeProvider
  ]

  /**
   * Combine static and dynamic providers into one list.
   * Dynamic providers can be passed at render time to extend context.
   */
  const allProviders = [...staticProviders, ...providers]

  /**
   * Recursively nests all providers right-to-left (last provider wraps first).
   * This creates a deeply nested provider tree that wraps the application.
   * 
   * The `Console` component is also appended after children for dev tools.
   */
  const providerHierarchy = allProviders.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    <>
      {children}
      <Console />
    </>
  )

  return providerHierarchy
}
