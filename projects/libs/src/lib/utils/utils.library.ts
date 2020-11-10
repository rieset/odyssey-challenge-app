export const generateAddress = () => {
  const prefix = '3M'
  const length = 36
  const key = Array.from(Array(length - prefix.length)).map((sym, index) => {
    return String.fromCharCode(Math.ceil(((Math.random() * 62 + index) % 62) + 64)).replace(/[^a-zA-Z]/g, '0')
  }).join('')

  return prefix + key
}
