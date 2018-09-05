const parseError = (actual, expected, line, offset) => {
  const message =
    `Parse error at ${line}:${offset}. Saw ${actual}; expected ${expected}.`
  throw new Error(message)
}

const parseOuter = (atom) => {
  // todo
}

const parse = atoms =>
  atoms
    .filter(a => !a['#'])
    .reduce((parse, a) =>
      (!parse
        ? parseOuter(a)
        : parse(a)))
    .ast

module.exports = {
  parse,
}
