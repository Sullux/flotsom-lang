const { load } = require('./load')
const { parse } = require('./parse')
const { exec } = require('./exec')

const execAst = (ast) => {
  console.log(ast)
  // todo
}

const execText = (input) => {
  console.log(input)
  // todo
}

const execFile = (file) => {
  // todo
  load(file)
  exec()
}

module.exports = {
  parse,
  execAst,
  execText,
  execFile,
}
