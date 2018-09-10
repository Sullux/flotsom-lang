const { lex } = require('./lex')
const { parse } = require('./parse')
const { readFileSync } = require('fs')

const source = readFileSync('./demo.fl').toString()

console.log(
  'Abstract Syntax Tree:\n',
  JSON.stringify(parse(source, lex(source)), undefined, 2)
)
