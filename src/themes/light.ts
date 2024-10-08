import { brand, secondary, red, green, alpha, gray } from './colors'
import { Typography } from './typography'

const theme = {
  palette: {
    primary: {
      text: brand[50],
      light: brand[200],
      main: brand[500],
      dark: brand[800],
      background: gray[900],
    },
    secondary: {
      text: gray[900],
      light: secondary[300],
      main: secondary[500],
      dark: secondary[800],
      background: gray[100]
    },
    warning: {
      main: '#F7B538',
      dark: '#F79F00'
    },
    error: {
      light: red[50],
      main: red[500],
      dark: red[700]
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800]
    },
    grey: {
      50: gray[50],
      100: gray[100],
      200: gray[200],
      300: gray[300],
      400: gray[400],
      500: gray[500],
      600: gray[600],
      700: gray[700],
      800: gray[800],
      900: gray[900]
    },
    divider: alpha(gray[300], 0.5),
    action: {
      selected: alpha(brand[200], 0.2)
    }
  },
  typography: { ...Typography }
}

export const mainLight = theme
