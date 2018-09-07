const { lex } = require('./lex')
const { parse } = require('./parse')

const compile = input =>
  parse(input, lex(input))

module.exports = {
  compile,
}
