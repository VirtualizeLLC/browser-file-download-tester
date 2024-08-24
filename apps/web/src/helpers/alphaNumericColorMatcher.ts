import colors from 'tailwindcss/colors'
const colorNamesMap = new Map()

Object.entries(colors).forEach(([key, val]) => {
  colorNamesMap.set(
    key,
    Object.entries(val).map(([key, val]) => ({ intensity: key, hexCode: val }))
  )
})
const colorNamesArray = [...colorNamesMap.entries()]

const numericOrder = '0123456789'
const alphaOrder = `abcdefghijklmnopqrstuvwxyz`
const alphaNumericOrder = `${numericOrder}${alphaOrder}`

const alphaNumericIndexMap = new Map()
alphaNumericOrder
  .split('')
  .forEach((character, index) => alphaNumericIndexMap.set(character, index))

const selectionRange = alphaNumericIndexMap.size / colorNamesArray.length

export const matchColorToSelector = (label: string) => {
  const labelLen = label.length
  if (!label || labelLen === 0) return 'gray-200'

  const labelFirstCharacter = label.slice(0, 1).toLocaleLowerCase()
  const labelIntegerForCharacter = alphaNumericIndexMap.get(labelFirstCharacter)
  const colorToFirstCharacter = Math.floor(
    labelIntegerForCharacter / selectionRange
  )

  const [selectedColor, colorHexesByIntensity] =
    colorNamesArray[colorToFirstCharacter]

  // fallback guard
  if (!Array.isArray(colorHexesByIntensity) || !selectedColor) return 'gray-200'

  const labelLastCharacter = label.slice(-1)

  // must be calculated per color otherwise it will be inaccurate
  const numericWeightPerColor =
    alphaNumericIndexMap.size / colorHexesByIntensity.length

  /**
   * Example 32 total character positions
   * 10 is the max number for color intensities
   * 32/10 = 3.2
   *
   * Then this last index looks up its value and its 31
   * so 31/3.2 = 9.6. This is floored to 9
   */
  const labelLastCharacterInteger = alphaNumericIndexMap.get(labelLastCharacter)
  const labelLastCharacterColorIndex = Math.floor(
    labelLastCharacterInteger / numericWeightPerColor
  )
  const { hexCode } = colorHexesByIntensity[labelLastCharacterColorIndex]

  return hexCode
}
