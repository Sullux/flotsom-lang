const { elementType } = require('./elementType')

const parseError = (actual, expected, line, offset) => {
  const message =
    `Parse error at ${line}:${offset}. Saw ${actual}; expected ${expected}.`
  throw new Error(message)
}

const parse =
  (atoms) => {}

const parseAny = parse(Object.values(elementType))

module.exports = {
  parse: parseAny,
}
