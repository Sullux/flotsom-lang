const { deepStrictEqual } = require('assert')

const { lex } = require('./lex')

describe('lex', () => {
  // whitespace
  it('should lex whitespace', () =>
    deepStrictEqual(
      lex('{\n \t\r\n}')[1],
      {
        name: 'whitespace', offset: 1, length: 5, position: { x: 2, y: 1 }
      }
    ))

  // multilineComment
  it('should lex a multiline comment', () =>
    deepStrictEqual(
      lex('## multiline\n    comment ##'),
      [{
        name: 'multilineComment', offset: 0, length: 27, position: { x: 1, y: 1 }
      }]
    ))
  it('should lex multiline comments', () =>
    deepStrictEqual(
      lex('{\n  foo: bar ## multiline\n    comment ##\n}')[7],
      {
        name: 'multilineComment', offset: 13, length: 27, position: { x: 12, y: 2 }
      }
    ))

  // comment
  it('should lex a comment', () =>
    deepStrictEqual(
      lex('# comment'),
      [{
        name: 'comment', offset: 0, length: 9, position: { x: 1, y: 1 }
      }]
    ))
  it('should lex comments', () =>
    deepStrictEqual(
      lex('{\n# comment\n}')[2],
      {
        name: 'comment', offset: 2, length: 10, position: { x: 1, y: 2 }
      }
    ))
  it('should lex partial-line comments', () =>
    deepStrictEqual(
      lex('{\nfoo: bar # comment\n}')[7],
      {
        name: 'comment', offset: 11, length: 10, position: { x: 10, y: 2 }
      }
    ))

  // string
  it('should lex a string', () =>
    deepStrictEqual(
      lex("{\nfoo: 'a string'\n}")[5],
      {
        name: 'string', offset: 7, length: 10, position: { x: 6, y: 2 }
      }
    ))

  // map
  it('should lex the start of a map', () =>
    deepStrictEqual(
      lex('{\nfoo: bar\n}')[0],
      {
        name: 'map', offset: 0, length: 1, start: true, end: false, position: { x: 1, y: 1 }
      }
    ))
  it('should lex the end of a map', () =>
    deepStrictEqual(
      lex('{\nfoo: bar\n}')[7],
      {
        name: 'map', offset: 11, length: 1, start: false, end: true, position: { x: 1, y: 3 }
      }
    ))

  // seq
  it('should lex the start of a sequence', () =>
    deepStrictEqual(
      lex('[ foo ]')[0],
      {
        name: 'seq', offset: 0, length: 1, start: true, end: false, position: { x: 1, y: 1 }
      }
    ))
  it('should lex the end of a sequence', () =>
    deepStrictEqual(
      lex('[ foo ]')[4],
      {
        name: 'seq', offset: 6, length: 1, start: false, end: true, position: { x: 7, y: 1 }
      }
    ))

  // comp
  it('should lex the start of a composition', () =>
    deepStrictEqual(
      lex('( foo )')[0],
      {
        name: 'comp', offset: 0, length: 1, start: true, end: false, position: { x: 1, y: 1 }
      }
    ))
  it('should lex the end of a composition', () =>
    deepStrictEqual(
      lex('( foo )')[4],
      {
        name: 'comp', offset: 6, length: 1, start: false, end: true, position: { x: 7, y: 1 }
      }
    ))

  // pipe
  it('should lex the start of a pipe', () =>
    deepStrictEqual(
      lex('< foo >')[0],
      {
        name: 'pipe', offset: 0, length: 1, start: true, end: false, position: { x: 1, y: 1 }
      }
    ))
  it('should lex the end of a pipe', () =>
    deepStrictEqual(
      lex('< foo >')[4],
      {
        name: 'pipe', offset: 6, length: 1, start: false, end: true, position: { x: 7, y: 1 }
      }
    ))

  // literal
  it('should lex a literal', () =>
    deepStrictEqual(
      lex("{ foo: /'a literal' }")[5],
      {
        name: 'literal', offset: 7, length: 1, position: { x: 8, y: 1 }
      }
    ))

  // addressOf
  it('should lex an addressOf', () =>
    deepStrictEqual(
      lex('{ foo: &bar }')[5],
      {
        name: 'addressOf', offset: 7, length: 1, position: { x: 8, y: 1 }
      }
    ))

  // external
  it('should lex an external', () =>
    deepStrictEqual(
      lex('{ foo: @bar }')[5],
      {
        name: 'external', offset: 7, length: 1, position: { x: 8, y: 1 }
      }
    ))

  // maybe
  it('should lex a maybe', () =>
    deepStrictEqual(
      lex('{ foo: ?bar }')[5],
      {
        name: 'maybe', offset: 7, length: 1, position: { x: 8, y: 1 }
      }
    ))

  // maybe
  it('should lex an xor', () =>
    deepStrictEqual(
      lex('{ foo | bar }')[4],
      {
        name: 'maybe', offset: 6, length: 1, position: { x: 7, y: 1 }
      }
    ))

  // maybe
  it('should lex a pair', () =>
    deepStrictEqual(
      lex('{ foo: bar }')[3],
      {
        name: 'maybe', offset: 5, length: 1, position: { x: 6, y: 1 }
      }
    ))
})
