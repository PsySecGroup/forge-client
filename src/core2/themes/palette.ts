import { alpha } from './utils'

export const gray = {
  50: '#FBFCFE',
  100: '#EAF0F5',
  200: '#D6E2EB',
  300: '#BFCCD9',
  400: '#94A6B8',
  500: '#5B6B7C',
  600: '#4C5967',
  700: '#364049',
  800: '#131B20',
  900: '#090E10'
}

export const green = {
  50: '#F6FEF6',
  100: '#E3FBE3',
  200: '#C7F7C7',
  300: '#A1E8A1',
  400: '#51BC51',
  500: '#1F7A1F',
  600: '#136C13',
  700: '#0A470A',
  800: '#042F04',
  900: '#021D02'
}

export const red = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c'
}

/**
 * Helper function to convert Hex to HSL
 */
function hexToHSL(hex: string): [number, number, number] {
  let r: number = parseInt(hex.substring(1, 3), 16) / 255
  let g: number = parseInt(hex.substring(3, 5), 16) / 255
  let b: number = parseInt(hex.substring(5, 7), 16) / 255

  let max: number = Math.max(r, g, b)
  let min: number = Math.min(r, g, b)
  let h: number = 0
  let s: number = 0
  let l: number = (max + min) / 2

  if (max !== min) {
    let d: number = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s, l]
}

/**
 * Helper function to convert HSL to Hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s = Math.min(Math.max(s, 0), 1)
  l = Math.min(Math.max(l, 0), 1)

  let c: number = (1 - Math.abs(2 * l - 1)) * s
  let x: number = c * (1 - Math.abs((h / 60) % 2 - 1))
  let m: number = l - c / 2
  let r: number = 0,
    g: number = 0,
    b: number = 0

  if (h < 60) {
    r = c
    g = x
    b = 0
  } else if (h < 120) {
    r = x
    g = c
    b = 0
  } else if (h < 180) {
    r = 0
    g = c
    b = x
  } else if (h < 240) {
    r = 0
    g = x
    b = c
  } else if (h < 300) {
    r = x
    g = 0
    b = c
  } else {
    r = c
    g = 0
    b = x
  }

  let rgb = [r + m, g + m, b + m].map((value) => Math.round(value * 255))
  return "#" + rgb.map((x) => x.toString(16).padStart(2, '0')).join('')
}

/**
 * Helper function to convert Hex to RGB
 */
function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)
  return [r, g, b]
}

/**
 * Helper function to convert RGB to Hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`
}

/**
 * Helper function to calculate luminance
 */
function calculateLuminance(r: number, g: number, b: number): number {
  // Normalize RGB values to [0, 1]
  const normalize = (value: number) => value / 255

  // Apply the luminance formula (standard formula for perceived brightness)
  const [rNormalized, gNormalized, bNormalized] = [r, g, b].map(normalize) as [number, number, number]

  const rLinear = rNormalized <= 0.03928
    ? rNormalized / 12.92
    : Math.pow((rNormalized + 0.055) / 1.055, 2.4)
  const gLinear = gNormalized <= 0.03928
    ? gNormalized / 12.92
    : Math.pow((gNormalized + 0.055) / 1.055, 2.4)
  const bLinear = bNormalized <= 0.03928
    ? bNormalized / 12.92
    : Math.pow((bNormalized + 0.055) / 1.055, 2.4)

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Function to calculate contrast ratio
 */
function calculateContrastRatio(luminance1: number, luminance2: number): number {
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Function to return the most contrasting calculation of white or black
 */
export function getContrastingColor(color: string): number {
  // Convert hex color to RGB
  const [r, g, b] = hexToRGB(color)

  // Calculate luminance of the given color
  const luminanceColor = calculateLuminance(r, g, b)

  // Calculate luminance of white (#FFFFFF) and black (#000000)
  const luminanceWhite = calculateLuminance(255, 255, 255)
  const luminanceBlack = calculateLuminance(0, 0, 0)

  // Calculate contrast ratio with white and black
  const contrastWithWhite = calculateContrastRatio(luminanceColor, luminanceWhite)
  const contrastWithBlack = calculateContrastRatio(luminanceColor, luminanceBlack)

  // Return the most contrasting calculation
  return Math.max(contrastWithWhite, contrastWithBlack)
}

/**
 * Function to generate triadic colors from a given color or random color
 */
export function getTriadicColors(color: string = ''): [string, string, string] {
  // If no color is given, generate a random hex color
  if (!color) {
    color = '#' + Math.floor(Math.random() * 16777215).toString(16)
  }

  // Convert hex to HSL
  const [h, s, l] = hexToHSL(color)

  // Generate triadic colors by rotating the hue by 120° and 240°
  const triadicColors:  [string, string, string] = [
    hslToHex((h + 120) % 360, s, l), // 120° rotation
    hslToHex((h + 240) % 360, s, l), // 240° rotation
    color, // Original color
  ]

  return triadicColors
}

/**
 * Function to generate gradient between two hex colors
 */
export function getGradient(startColor: string, endColor: string, steps: number): string[] {
  // Convert start and end colors to RGB
  const [r1, g1, b1] = hexToRGB(startColor)
  const [r2, g2, b2] = hexToRGB(endColor)

  // Generate the gradient colors
  const gradient: string[] = []

  for (let i = 0; i < steps; i++) {
    // Interpolate the RGB values for each step
    const r = Math.round(r1 + (r2 - r1) * (i / (steps - 1)))
    const g = Math.round(g1 + (g2 - g1) * (i / (steps - 1)))
    const b = Math.round(b1 + (b2 - b1) * (i / (steps - 1)))

    // Convert the interpolated RGB value back to Hex and add to the gradient
    gradient.push(rgbToHex(r, g, b))
  }

  return gradient
}

export function getPalette (
  sourceColor: string = '',
  warningColor: string = '#8B0000',
  errorColor: string = '#FF8C00',
  successColor: string = '#006400'
) {
  const triad = getTriadicColors(sourceColor)
  const primaryText = getContrastingColor(triad[0])
  const secondaryText = getContrastingColor(triad[1])

  return {
    primary: {
      text: primaryText,
      light: getGradient(triad[0], '#FFFFFF', 3)[1],
      main: triad[0],
      dark: getGradient(triad[0], '#000000', 3)[1],
      background: gray[900],
    },
    secondary: {
      text: secondaryText,
      light: getGradient(triad[1], '#FFFFFF', 3)[1],
      main: triad[1],
      dark: getGradient(triad[1], '#000000', 3)[1],
      background: gray[400]
    },
    warning: {
      light: getGradient(warningColor, '#FFFFFF', 3)[1],
      main: warningColor,
      dark: getGradient(warningColor, '#FFFFFF', 3)[1]
    },
    error: {
      light: getGradient(errorColor, '#FFFFFF', 3)[1],
      main: errorColor,
      dark: getGradient(errorColor, '#FFFFFF', 3)[1]
    },
    success: {
      light: getGradient(successColor, '#FFFFFF', 3)[1],
      main: successColor,
      dark: getGradient(successColor, '#FFFFFF', 3)[1]
    },
    gray,
    divider: alpha(gray[600], 0.3),
    action: {
      selected: alpha(triad[2], 0.2)
    }
  }
}