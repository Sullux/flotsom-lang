const { fail, throws } = require('assert')

const { lex } = require('./lex')
const { parse, pure: { parseFile } } = require('./parse')
const {
  opcode: {
    file,
    map,
    seq,
    // pipe,
    value,
    literal,
    // addressOf,
    // external,
    xor,
    // maybe,
    pair,
    // eval: valueOf,
  }
} = require('./opcode')

const compile = input =>
  parse(input, lex(input))

const arrayEquals = (actual, expected) =>
  (actual === expected) ||
  (Array.isArray(actual) &&
    (actual.length === expected.length) &&
    actual.every((v, i) => arrayEquals(v, expected[i])))

const compare = (actual, expected) =>
  (arrayEquals(actual, expected)
    ? true
    : console.log('actual', JSON.stringify(actual, undefined, 2)) ||
      console.log('expected', JSON.stringify(expected, undefined, 2)) ||
      fail(actual, expected))

describe('parse', () => {
  describe('parse', () => {
    it('should parse an empty file', () =>
      compare(
        compile(''),
        []
      ))
    it('should parse an empty map', () =>
      compare(
        compile('{}'),
        [[map]]
      ))
    it('should parse a map', () =>
      compare(
        compile('{ foo }'),
        [[map, [value, 'foo']]]
      ))
    it('should parse a pair', () =>
      compare(
        compile('foo: bar'),
        [[pair, [value, 'foo'], [value, 'bar']]]
      ))
    it('should parse a sequence', () =>
      compare(
        compile('{ foo: [bar baz] }'),
        [
          [map,
            [pair,
              [value, 'foo'],
              [seq,
                [value, 'bar'],
                [value, 'baz']]]]
        ]
      ))
    it('should parse a literal', () =>
      compare(
        compile('{ foo: [bar /baz] }'),
        [
          [map,
            [pair,
              [value, 'foo'],
              [seq,
                [value, 'bar'],
                [literal,
                  [value, 'baz']]]]]
        ]
      ))
    it('should parse an exclusive or', () =>
      compare(
        compile('foo | bar | baz'),
        [[xor, [value, 'foo'], [value, 'bar'], [value, 'baz']]]
      ))
    it('should throw on unfollowed decorator', () =>
      throws(() => compile('{ /}')))
  })

  describe('parseFile', () => {
    it('should parse into a file operation', () => {
      const [ref, path, input, elements, debug, expected] =
        [...Array(6)].map((v, i) => Symbol(i))
      const parseStub = (...args) =>
        (compare(args, [input, elements, debug])
          ? expected
          : ['unexpected args in parse:', ...args])
      compare(
        parseFile(parseStub)(ref, path, input, elements, debug),
        [file, ref, path, expected]
      )
    })
  })
})
