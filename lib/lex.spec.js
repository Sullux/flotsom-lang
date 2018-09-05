const { deepStrictEqual } = require('assert')

const { lex } = require('./lex')

describe.only('lex', () => {
  // whitespace
  it('should lex whitespace', () =>
    deepStrictEqual(
      lex('{\n \t\r\n}')[1],
      { name: 'whitespace', offset: 1, length: 5 }
    ))

  // multilineComment
  it('should lex a multiline comment', () =>
    deepStrictEqual(
      lex('## multiline\n    comment ##'),
      [{ name: 'multilineComment', offset: 0, length: 27 }]
    ))
  it('should lex multiline comments', () =>
    deepStrictEqual(
      lex('{\n  foo: bar ## multiline\n    comment ##\n}')[6],
      { name: 'multilineComment', offset: 13, length: 27 }
    ))

  // comment
  it('should lex a comment', () =>
    deepStrictEqual(
      lex('# comment'),
      [{ name: 'comment', offset: 0, length: 9 }]
    ))
  it('should lex comments', () =>
    deepStrictEqual(
      lex('{\n# comment\n}')[2],
      { name: 'comment', offset: 2, length: 10 }
    ))
  it('should lex partial-line comments', () =>
    deepStrictEqual(
      lex('{\nfoo: bar # comment\n}')[6],
      { name: 'comment', offset: 11, length: 10 }
    ))

  // string
  it('should lex a string', () =>
    deepStrictEqual(
      lex("{\nfoo: 'a string'\n}")[4],
      { name: 'string', offset: 7, length: 10 }
    ))

  // map
  it('should lex the start of a map', () =>
    deepStrictEqual(
      lex('{\nfoo: bar\n}')[0],
      {
        name: 'map', offset: 0, length: 1, start: true, end: false
      }
    ))
  it('should lex the end of a map', () =>
    deepStrictEqual(
      lex('{\nfoo: bar\n}')[6],
      {
        name: 'map', offset: 11, length: 1, start: false, end: true
      }
    ))

  // seq
  it('should lex the start of a sequence', () =>
    deepStrictEqual(
      lex('[ foo ]')[0],
      {
        name: 'seq', offset: 0, length: 1, start: true, end: false
      }
    ))
  it('should lex the end of a sequence', () =>
    deepStrictEqual(
      lex('[ foo ]')[4],
      {
        name: 'seq', offset: 6, length: 1, start: false, end: true
      }
    ))

  // comp
  it('should lex the start of a composition', () =>
    deepStrictEqual(
      lex('( foo )')[0],
      {
        name: 'comp', offset: 0, length: 1, start: true, end: false
      }
    ))
  it('should lex the end of a composition', () =>
    deepStrictEqual(
      lex('( foo )')[4],
      {
        name: 'comp', offset: 6, length: 1, start: false, end: true
      }
    ))

  // pipe
  it('should lex the start of a pipe', () =>
    deepStrictEqual(
      lex('< foo >')[0],
      {
        name: 'pipe', offset: 0, length: 1, start: true, end: false
      }
    ))
  it('should lex the end of a pipe', () =>
    deepStrictEqual(
      lex('< foo >')[4],
      {
        name: 'pipe', offset: 6, length: 1, start: false, end: true
      }
    ))

  // literal
  it('should lex a literal', () =>
    deepStrictEqual(
      lex("{ foo: /'a literal' }")[4],
      { name: 'literal', offset: 7, length: 1 }
    ))

  // addressOf
  it('should lex an addressOf', () =>
    deepStrictEqual(
      lex('{ foo: &bar }')[4],
      { name: 'addressOf', offset: 7, length: 1 }
    ))

  // external
  it('should lex an external', () =>
    deepStrictEqual(
      lex('{ foo: @bar }')[4],
      { name: 'external', offset: 7, length: 1 }
    ))

  // maybe
  it('should lex a maybe', () =>
    deepStrictEqual(
      lex('{ foo: ?bar }')[4],
      { name: 'maybe', offset: 7, length: 1 }
    ))
})
