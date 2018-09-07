const { opcode, codeop } = require('./opcode')

const parseError = (actual, expected, line, offset) => {
  const message =
    `Parse error at ${line}:${offset}. Saw ${actual}; expected ${expected}.`
  throw new Error(message)
}

const ends = {
  map: '}',
  seq: ']',
  comp: ')',
  pipe: '>',
}

const ignored = [
  'whitespace',
  'comment',
  'multilineComment'
]

const valueOpcode = opcode.value

const mustPopOps = [
  opcode.literal,
  opcode.addressOf,
  opcode.external,
  opcode.maybe,
  opcode.eval,
  opcode.xor,
  opcode.pair
]

const shouldPop = v =>
  mustPopOps.includes(v[0])

const parse = (input, elements) => {
  let result = []
  let relativeOffset = 0
  const maxOffset = elements.length
  const stack = []
  const popDecorators = () => {
    while (shouldPop(result)) {
      result = stack.pop()
    }
  }
  const assertshouldNotPop = (name, x, y) => {
    if (shouldPop(result)) {
      parseError(ends[name], 'a value', y, x)
    }
  }
  while (relativeOffset < maxOffset) {
    const {
      name, offset, length, end, position: { x, y }
    } = elements[relativeOffset]
    relativeOffset += 1
    if (ignored.includes(name)) {
      continue // eslint-disable-line no-continue
    }
    if (end) {
      const resultName = codeop[result[0]]
      assertshouldNotPop(name, x, y)
      if (resultName !== name) {
        parseError(ends[name], ends[resultName], y, x)
      }
      result = stack.pop()
      popDecorators()
      continue // eslint-disable-line no-continue
    }
    const op = [opcode[name] || valueOpcode]
    switch (name) {
      case 'map':
      case 'seq':
      case 'comp':
      case 'pipe':
        result.push(op)
        stack.push(result)
        result = op
        break
      case 'string':
        result.push(op)
        op.push([input.substr(offset + 1, length - 1), y, x])
        popDecorators()
        break
      case 'literal':
      case 'addressOf':
      case 'external':
      case 'maybe':
      case 'eval':
        result.push(op)
        stack.push(result)
        result = op
        break
      case 'xor':
        assertshouldNotPop(name, x, y)
        if (result[0][0] === opcode.xor) {
          stack.push(result) // unpop for chained xor
          result = result[result.length - 1]
          break
        }
        op.push(result.pop())
        result.push(op)
        stack.push(result)
        result = op
        break
      case 'pair':
        assertshouldNotPop(name, x, y)
        op.push(result.pop())
        result.push(op)
        stack.push(result)
        result = op
        break
      default:
        result.push(op)
        op.push(input.substr(offset, length))
        popDecorators()
    }
  }
  return result
}

module.exports = {
  parse,
}
