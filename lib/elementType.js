const elementType = Object.freeze(([
  'block',
  'decorator',
  'atom'
]).reduce((obj, key) => (obj[key] = Symbol(key)) && obj, {}))

module.exports = {
  elementType,
}
