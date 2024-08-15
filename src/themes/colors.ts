export const brand = {
  50: '#F0F7FF',
  100: '#CEE5FD',
  200: '#9CCCFC',
  300: '#55A6F6',
  400: '#0A66C2',
  500: '#0959AA',
  600: '#064079',
  700: '#033363',
  800: '#02294F',
  900: '#021F3B'
}

export const secondary = {
  50: '#F9F0FF',
  100: '#E9CEFD',
  200: '#D49CFC',
  300: '#B355F6',
  400: '#750AC2',
  500: '#6709AA',
  600: '#490679',
  700: '#3B0363',
  800: '#2F024F',
  900: '#23023B'
}

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

export function alpha (hexColor: string, opacity: number): string {
  // Ensure the opacity value is within the valid range (0 to 1)
  const validOpacity = Math.max(0, Math.min(1, opacity))

  // Convert the opacity to a hexadecimal value
  const alphaHex = Math.round(validOpacity * 255).toString(16).toUpperCase()

  // Pad the alpha value if it's a single digit
  const paddedAlphaHex = alphaHex.length === 1 ? `0${alphaHex}` : alphaHex

  // Append the alpha value to the original hex color
  const modifiedHexColor = `${hexColor}${paddedAlphaHex}`

  return modifiedHexColor
}
