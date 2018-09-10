const names = [
  'file',
  'map',
  'seq',
  'pipe',
  'value',
  'literal',
  'addressOf',
  'external',
  'xor',
  'maybe',
  'pair',
  'eval'
]

const opcode = names.reduce(
  (result, name, i) => (result[name] = i + 1) && result, // eslint-disable-line no-param-reassign
  {}
)

const codeop = names.reduce(
  (result, name) => (result[opcode[name]] = name) && result, // eslint-disable-line no-param-reassign
  {}
)

module.exports = {
  opcode,
  codeop,
}
