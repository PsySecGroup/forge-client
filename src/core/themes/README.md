# Theme System

A comprehensive theming system for SolidJS applications with automatic color palette generation, triadic color harmonies, and dynamic contrast calculation.

## Features

- 🎨 **Automatic Color Palette Generation** - Generate complete theme palettes from a single source color
- 🔄 **Triadic Color Harmony** - Uses color theory to create harmonious color combinations
- ⚡ **Dynamic Contrast Calculation** - Automatically determines optimal text colors for accessibility
- 🎯 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 📱 **Responsive Design Ready** - Built-in gray scale and alpha utilities

## Basic Setup

### 1. Wrap Your App with ThemeProvider

```tsx
import { ThemeProvider } from './themes'
import App from './App'

function Root() {
 return (
   <ThemeProvider>
     <App />
   </ThemeProvider>
 )
}
```

### 2. Access Theme in Components

Since the current implementation uses a global store, you can access the theme directly:

```tsx
import { useContext } from 'solid-js'
import { ThemeStore } from './themes/state'

function MyComponent() {
 const [theme] = useContext(ThemeStore) // Access the theme store
 
 return (
   <div style={{
     'background-color': theme.primary?.main,
     color: theme.primary?.text
   }}>
     Themed content
   </div>
 )
}
```

## API Reference

### `getPalette(sourceColor?, warningColor?, errorColor?, successColor?)`

Generates a complete theme palette from a source color.

```tsx
import { getPalette } from './themes/palette'

// Generate palette from green
const theme = getPalette('#00AA00')

// Custom semantic colors
const customTheme = getPalette(
 '#3B82F6',  // source color
 '#F59E0B',  // warning
 '#EF4444',  // error  
 '#10B981'   // success
)
```

### Palette Structure

```typescript
type Palette = {
 primary: {
   text: string      // Contrasting text color
   light: string     // Lighter variant
   main: string      // Main color
   dark: string      // Darker variant
   background: string // Background color
 }
 secondary: {
   text: string
   light: string
   main: string
   dark: string
   background: string
 }
 warning: { light: string, main: string, dark: string }
 error: { light: string, main: string, dark: string }
 success: { light: string, main: string, dark: string }
 gray: {
   50: string    // Lightest
   100: string
   200: string
   300: string
   400: string
   500: string
   600: string
   700: string
   800: string
   900: string   // Darkest
 }
 divider: string
 action: {
   selected: string
 }
}
```

### Utility Functions

#### `getTriadicColors(color?)`

Generate three harmonious colors using triadic color theory:

```tsx
import { getTriadicColors } from './themes/palette'

const [color1, color2, original] = getTriadicColors('#FF6B6B')
// Returns: ['#6BFF6B', '#6B6BFF', '#FF6B6B']
```

#### `getContrastingColor(color)`

Get the optimal contrasting color (black or white variant) for text:

```tsx
import { getContrastingColor } from './themes/palette'

const textColor = getContrastingColor('#3B82F6')
// Returns: 'rgb(255, 255, 255)' or similar high-contrast color
```

#### `getGradient(startColor, endColor, steps)`

Generate a smooth color gradient between two colors:

```tsx
import { getGradient } from './themes/palette'

const gradient = getGradient('#FF0000', '#0000FF', 5)
// Returns: ['#FF0000', '#BF003F', '#7F007F', '#3F00BF', '#0000FF']
```

#### `alpha(hexColor, opacity)`

Add transparency to a hex color:

```tsx
import { alpha } from './themes/utils'

const semiTransparent = alpha('#FF6B6B', 0.5)
// Returns: '#FF6B6B80'
```

### Component Styling with `getStyling`

The `getStyling` function helps merge classes and styles for components:

```tsx
import { getStyling } from './themes/style'

function Button(props) {
 const { classes: buttonClasses, style: buttonStyles } = getStyling({
   className: props.class,
   classes: {
     'btn-primary': props.primary,
     'btn-disabled': props.disabled
   },
   style: props.style,
   theme: {
     'background-color': ThemeStore[0].primary?.main,
     color: ThemeStore[0].primary?.text
   }
 })
 
 return (
   <button 
     class={buttonClasses}
     style={buttonStyles}
   >
     {props.children}
   </button>
 )
}
```

## Usage Examples

### Creating a Themed Button Component

```tsx
import { useContext } from 'solid-js'
import { getStyling } from './themes/style'
import { ThemeStore } from './themes/state'

function ThemedButton({ onClick, children}: ParentProps<{ onClick: () => void}>) {
 const [theme] = useContext(ThemeStore)
 
 const { classes: buttonClasses, style: buttonStyles } = getStyling({
   className: props.class,
   style: props.style,
   theme: {
     'background-color': theme.primary?.main,
     color: theme.primary?.text,
     border: 'none',
     padding: '0.5rem 1rem',
     'border-radius': '0.25rem',
     cursor: 'pointer'
   }
 })
 
 return (
   <button 
     class={buttonClasses}
     style={buttonStyles}
     onClick={props.onClick}
   >
     {props.children}
   </button>
 )
}
```

### Using Gray Scale

```tsx
import { useContext } from 'solid-js'
import { ThemeStore } from './themes/state'

function Card() {
 const [theme] = useContext(ThemeStore)
 
 return (
   <div style={{
     'background-color': theme.gray?.[100],
     border: `1px solid \${theme.gray?.[300]}`,
     'border-radius': '0.5rem',
     padding: '1rem'
   }}>
     Card content
   </div>
 )
}
```

### Creating Status Indicators

```tsx
import { useContext } from 'solid-js'
import { ThemeStore } from './themes/state'

function StatusBadge(props: { type: 'success' | 'warning' | 'error' }) {
 const [theme] = useContext(ThemeStore)
 
 const colors = {
   success: theme.success,
   warning: theme.warning,
   error: theme.error
 }
 
 const statusColor = colors[props.type]
 
 return (
   <span style={{
     'background-color': statusColor?.light,
     color: statusColor?.dark,
     padding: '0.25rem 0.5rem',
     'border-radius': '0.25rem',
     'font-size': '0.875rem'
   }}>
     {props.type}
   </span>
 )
}
```

## Customization

### Changing the Default Theme

Modify the initial state in `themes/state.ts`:
* `@TODO`: Inject this better

```tsx
// Change from default green to blue
const state = getPalette('#3B82F6')
```

### Adding Custom Colors

Extend the palette type and generation function:

```tsx
// In palette.ts, extend the Palette type
export type Palette = {
 // ... existing properties
 info?: {
   light?: string
   main?: string
   dark?: string
 }
}

// Add to getPalette function
export function getPalette(
 sourceColor: string = '',
 warningColor: string = '#8B0000',
 errorColor: string = '#FF8C00',
 successColor: string = '#006400',
 infoColor: string = '#1976D2'  // New parameter
): Palette {
 // ... existing code
 
 return {
   // ... existing properties
   info: {
     light: getGradient(infoColor, '#FFFFFF', 3)[1] as string,
     main: infoColor,
     dark: getGradient(infoColor, '#000000', 3)[1] as string
   }
 }
}
```

## Best Practices

1. **Use Semantic Colors**: Prefer `theme.primary.main` over hardcoded colors
2. **Leverage Contrast Calculation**: Use `getContrastingColor()` for accessible text
3. **Consistent Spacing**: Use the gray scale for consistent borders and backgrounds
4. **Alpha for Overlays**: Use the `alpha()` utility for transparent overlays and shadows

## Notes

- The current implementation uses a global store approach
- Colors are automatically calculated for optimal contrast and accessibility
- The triadic color system ensures harmonious color combinations
- All colors are generated as hex values for maximum compatibility