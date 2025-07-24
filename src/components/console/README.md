# 🧰 @PsySecGroup/forge-console

A drop-in developer console for Forge applications — toggleable with the backtick key (`), supports custom commands, history navigation, and a reactive message log. Built with Solid primitives and clean architectural patterns.

---

## ✨ Features

- ✅ Toggle with backtick key (`) like a developer console
- 🧠 Command parsing with support for quoted arguments
- 📜 Command history navigation with arrow keys
- 📡 Built-in reactive message store
- 🔌 Custom command registration with optional permissions
- 🧪 Lightweight and idiomatic for SolidJS

---

## 📦 Installation

```bash
npm install @PsySecGroup/forge-console
```

Or using pnpm:

```bash
pnpm add @PsySecGroup/forge-console
```

---

## 🚀 Usage

### 1. Wrap your app with `<ConsoleProvider>`

```tsx
import { ConsoleProvider } from '@PsySecGroup/forge-console'

<ConsoleProvider>
  <App />
</ConsoleProvider>
```

### 2. Add the `<Console />` component

Add the console near the root of your UI layout:

```tsx
import Console from 'solid-console'

const Layout = () => (
  <>
    <MainContent />
    <Console />
  </>
)
```

### 3. Register commands (optional)

```tsx
import { ForgeApp } from './AppShell'
import type { ConsoleCommand } from 'solid-console'

const commands: ConsoleCommand[] = [
  {
    name: 'hello',
    onExecute: () => '👋 Hello world!'
  },
  {
    name: 'sum',
    onExecute: (args) => {
      const numbers = args.map(Number)
      return `Sum: \${numbers.reduce((a, b) => a + b, 0)}`
    }
  }
]

<ForgeApp consoleCommands={commands}>
  <App />
</ForgeApp>
```

You can also set commands later with:

```ts
getConsoleActions().setCommands([...])
```

---

## 🧩 API Reference

### `ConsoleCommand`

```ts
type ConsoleCommand = {
  name: string
  onExecute: (args: (string | number)[]) => string | false | undefined
  permissions?: (string | number)[]
}
```

### `getConsoleActions()`

Provides console-side actions for integration and control:

- `sendCommand(message?: string, permissions?: string[])`
- `addMessage(message: string)`
- `updatePrompt(message: string)`
- `setCommands(commands: ConsoleCommand[])`
- `runCommand(name, args, permissions)`

---

## 🧠 Architecture

### Reactive State

The console uses Solid's reactive store API:

- `messages[]`: message history
- `commands[]`: command definitions
- `prompt`: current input string

### Command Parsing

Arguments support:

- Quoted strings: `"hello world"` or `'multi word'`
- Numbers: `"3"` becomes `3` automatically

### Permissions

Optional `permissions` can restrict command usage:

- Commands define a list of `permissions`
- The user must pass all required permissions to `sendCommand(...)`

---

## ⌨️ Keyboard Shortcuts

| Key               | Action                     |
|------------------|----------------------------|
| Backtick (`)     | Toggle console visibility  |
| Enter            | Execute the command         |
| Arrow Up / Down  | Navigate command history    |

---

## 🎨 Styling

Styled using CSS Modules via `index.module.css`. You can override styles or use class names like:

- `.consoleWrapper`
- `.consoleContent`
- `.consoleInput`
- `.consoleLine`
