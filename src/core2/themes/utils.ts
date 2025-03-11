/**
 * 
 * @param hexColor 
 * @param opacity 
 * @returns 
 */
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
