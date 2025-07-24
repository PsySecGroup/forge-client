# 🧭 @PsySecGroup/forge-navigation

A lightweight, reactive navigation manager for SolidJS apps. Manage URL hash-based routing with history tracking, back/forward navigation, and reactive state.

---

## ⚡ Features

- Reactive navigation state: current location, history, and reference index  
- Hash-based navigation management  
- Programmatic `goto`, `goBack`, and `goForward` actions  
- Integration with browser `popstate` and `hashchange` events  
- Navigation context and provider for global state access  
- `NavButton` component with active state based on current location  
- `NavButtonGenerator` helper for icon + label buttons  

---

## 📦 Installation

```bash
npm install @PsySecGroup/forge-navigation
```

Or with pnpm:

```bash
pnpm add @PsySecGroup/forge-navigation
```

---

## 🚀 Usage

### 1. Wrap your app with the `NavigationProvider`

```tsx
import { NavigationProvider } from '@PsySecGroup/forge-navigation'

<NavigationProvider>
  <App />
</NavigationProvider>
```

### 2. Use `NavButton` to create navigation buttons

```tsx
import { NavButton } from '@PsySecGroup/forge-navigation'

<NavButton location="home" prefixHighlight>
  Home
</NavButton>

<NavButton location="settings">
  Settings
</NavButton>
```

### 3. Use `NavButtonGenerator` for icon + label buttons

```tsx
import { NavButtonGenerator } from '@PsySecGroup/forge-navigation'
import { Icon } from 'your-icon-library'

<NavButtonGenerator
  location="dashboard"
  label="Dashboard"
  iconName="dashboard"
  prefixHighlight={true}
/>
```

### 4. Access navigation state and actions

```tsx
import { getNavigationActions, NavigationContext } from '@PsySecGroup/forge-navigation'
import { useContext } from 'solid-js'

const [navigation] = useContext(NavigationContext)
const { goto, goBack, goForward } = getNavigationActions()

console.log('Current location:', navigation.location)

goto('profile')       // Navigate to #profile
goBack(1)             // Go back in history
goForward(2)          // Go forward in history
```

---

## 🔍 API

### Navigation State

| Property       | Type       | Description                          |
| -------------- | ---------- | ---------------------------------- |
| `history`     | `string[]` | Array of visited locations          |
| `referenceIndex` | `number`  | Current position in the history array |
| `location`    | `string`  | Current active location             |

### Navigation Actions

| Method          | Signature                         | Description                                      |
| --------------- | -------------------------------- | ------------------------------------------------ |
| `goto`        | `(location: string, referenceIndex?: number) => boolean` | Navigate to a new location (hash)               |
| `goBack`      | `(stepsBack?: number) => void` | Go back in navigation history by N steps         |
| `goForward`   | `(stepsForward?: number) => void` | Go forward in navigation history by N steps      |

### Components

#### `<NavButton />`

A button that navigates to a specified location on click.

**Props:**

| Prop           | Type       | Description                              |
| -------------- | ---------- | -------------------------------------- |
| `location`    | `string`  | The target location to navigate to (hash) |
| `prefixHighlight` | `boolean` | If true, active styling applies if current location starts with `location` |
| `children`    | `JSX.Element` | Button contents (text, icons, etc.)    |

#### `NavButtonGenerator(location, label, iconName?, prefixHighlight?)`

Helper function to create a `<NavButton />` with an optional icon and label.
