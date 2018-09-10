const { strictEqual, throws } = require('assert')

const { compile } = require('./interop')

describe('interop', () => {
  describe('compile', () => {
    it('should execute compiled code', () =>
      strictEqual(compile('suffix', 'x => x + " bar"')('foo'), 'foo bar'))
    it('should throw when compiled code throws', () =>
      throws(() => compile('suffix', 'x => x + bar')('foo')))
    it('should retain context across calls', () => {
      const mutable = compile(
        'mutable',
        '(...args) => args.length ? state = args[0] : state',
        { state: undefined }
      )
      mutable('foo')
      strictEqual(mutable(), 'foo')
    })
    it('should respect a callback', () =>
      new Promise(resolve =>
        compile(
          'eventual',
          '(x, cb) => setTimeout(() => cb(x + " bar"), 1)'
        )('foo', resolve))
        .then(result => strictEqual(result, 'foo bar')))
  })
})
