const { strictEqual, notStrictEqual } = require('assert')

const { elementType } = require('./elementType')

describe('elementType', () => {
  it('should equate same element types', () => {
    strictEqual(elementType.block, elementType.block)
  })
  it('should should not equate different element types', () => {
    notStrictEqual(elementType.block, elementType.decorator)
    notStrictEqual(elementType.block, Symbol('block'))
  })
  it('should freeze element types', () => {
    elementType.block = Symbol('foo')
    strictEqual(elementType.block, elementType.block)
  })
})
