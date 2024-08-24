function padZero(str: string, len = 2) {
  const zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}

/**
 *
 * @credit https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
 * use invert-color from the same author
 * @param hex
 * @param bw
 * @returns
 */
export function invertColorV1(hex: string, bw: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  let r: number = parseInt(hex.slice(0, 2), 16)
  let g: number = parseInt(hex.slice(2, 4), 16)
  let b: number = parseInt(hex.slice(4, 6), 16)

  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
  }
  // invert color components
  r = 255 - r
  g = 255 - g
  b = 255 - b
  // pad each with zeros and return
  return (
    '#' +
    padZero(r.toString(16)) +
    padZero(g.toString(16)) +
    padZero(b.toString(16))
  )
}
