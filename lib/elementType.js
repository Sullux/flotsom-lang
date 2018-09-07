const elementType = Object.freeze(([
  'block',
  'decorator',
  'atom'
// eslint-disable-next-line no-param-reassign
]).reduce((obj, key) => (obj[key] = Symbol(key)) && obj, {}))

module.exports = {
  elementType,
}
