import { brand, secondary, green, alpha, gray } from './colors'
import { Typography } from './typography'

const theme = {
  palette: {
    primary: {
      contrastText: brand[100],
      light: brand[300],
      main: brand[400],
      dark: brand[800]
    },
    secondary: {
      light: secondary[400],
      main: secondary[500],
      dark: secondary[900]
    },
    warning: {
      main: '#F7B538',
      dark: '#F79F00'
    },
    error: {
      light: '#D32F2F',
      main: '#D32F2F',
      dark: '#B22A2A'
    },
    success: {
      light: green[400],
      main: green[500],
      dark: green[700]
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
    divider: alpha(gray[600], 0.3),
    background: {
      primary: gray[900],
      secondary: gray[100]
    },
    text: {
      primary: '#fff',
      secondary: gray[400]
    },
    action: {
      selected: alpha(brand[800], 0.2)
    }
  },
  typography: { ...Typography }
}

export const mainDark = theme
