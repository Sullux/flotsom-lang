const { elementType } = require('./elementType')

const matchesRegex = (name, regex) =>
  (input, offset) => {
    regex.lastIndex = offset // eslint-disable-line no-param-reassign
    const matches = regex.exec(input)
    return matches
      ? { name, offset, length: matches[0].length }
      : false
  }

const matchesChar = (name, c, options = {}) =>
  (input, offset) => (input[offset] === c
    ? {
      name, offset, length: 1, ...options
    }
    : false)

const elementMap = {
  whitespace: {
    startChars: [' ', '\t', '\r', '\n'],
    type: elementType.atom,
    matches: matchesRegex('whitespace', /\s+/ym),
  },
  multilineComment: {
    startChars: ['#'],
    type: elementType.atom,
    matches: matchesRegex('multilineComment', /##[\s\S]*?##/y),
  },
  comment: {
    startChars: ['#'],
    type: elementType.atom,
    matches: matchesRegex('comment', /#.*?(\n|$)/y),
  },
  string: {
    startChars: ["'"],
    type: elementType.atom,
    matches: matchesRegex('string', /'([^\\]|\\.)*?'/y),
  },
  map: {
    startChars: ['{', '}'],
    type: elementType.block,
    matchesStart: matchesChar('map', '{', { start: true, end: false }),
    matchesEnd: matchesChar('map', '}', { start: false, end: true }),
  },
  seq: {
    startChars: ['[', ']'],
    type: elementType.block,
    matchesStart: matchesChar('seq', '[', { start: true, end: false }),
    matchesEnd: matchesChar('seq', ']', { start: false, end: true }),
  },
  comp: {
    startChars: ['(', ')'],
    type: elementType.block,
    matchesStart: matchesChar('comp', '(', { start: true, end: false }),
    matchesEnd: matchesChar('comp', ')', { start: false, end: true }),
  },
  pipe: {
    startChars: ['<', '>'],
    type: elementType.block,
    matchesStart: matchesChar('pipe', '<', { start: true, end: false }),
    matchesEnd: matchesChar('pipe', '>', { start: false, end: true }),
  },
  literal: {
    startChars: ['/'],
    type: elementType.decorator,
    matches: matchesChar('literal', '/'),
  },
  addressOf: {
    startChars: ['&'],
    type: elementType.decorator,
    matches: matchesChar('addressOf', '&'),
  },
  external: {
    startChars: ['@'],
    type: elementType.decorator,
    matches: matchesChar('external', '@'),
  },
  maybe: {
    startChars: ['?'],
    type: elementType.decorator,
    matches: matchesChar('maybe', '?'),
  },
  xor: {
    startChars: ['|'],
    type: elementType.decorator,
    matches: matchesChar('xor', '|'),
  },
  pair: {
    startChars: [':'],
    type: elementType.decorator,
    matches: matchesChar('pair', ':'),
  },
  eval: {
    startChars: ['~'],
    type: elementType.decorator,
    matches: matchesChar('eval', '~'),
  }
}

const elementsByChar = Object.entries(elementMap)
  .reduce(
    (map, [name, value]) =>
      value.startChars.forEach(char =>
        map[char] = map[char] // eslint-disable-line no-param-reassign
          ? map[char].push({ name, ...value }) && map[char]
          : [{ name, ...value }])
          || map,
    {}
  )

const matchLabel = (input, offset) => {
  const maxLength = input.length
  let relativeOffset = offset
  while (relativeOffset < maxLength) {
    const c = input[relativeOffset]
    if (c === '\\') {
      relativeOffset += 2
      continue // eslint-disable-line no-continue
    }
    if (elementsByChar[c]) {
      break
    }
    relativeOffset += 1
  }
  const length = relativeOffset - offset
  return length ? { name: 'label', offset, length } : false
}

const findElement = (input, offset) =>
  (elementsByChar[input[offset]] || [{ matches: matchLabel }])
    .map(({ matches, matchesStart, matchesEnd }) =>
      (matches
        ? matches(input, offset)
        : matchesStart(input, offset) || matchesEnd(input, offset)))
    .find(element => !!element)

const multilineElements = ['whitespace', 'multilineComment', 'string']

const lex = (input) => {
  let offset = 0
  const position = { x: 1, y: 1 }
  const length = input.length
  const elements = []
  while (offset < length) {
    const element = findElement(input, offset)
    element.position = { ...position }
    if (multilineElements.includes(element.name)) {
      const chars = [...input.substr(offset, element.length)]
      chars.forEach(c =>
        (c === '\n'
          ? position.y += (position.x = 1) // eslint-disable-line no-multi-assign
          : position.x += 1))
    } else {
      position.x += element.length
    }
    elements.push(element)
    offset += element.length
  }
  return elements
}

module.exports = {
  lex,
}
