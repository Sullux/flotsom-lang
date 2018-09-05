const { load } = require('./load')
const { parse } = require('./parse')
const { compile } = require('./compile')

const defaultBuildOptions = {}

const pure = {
  defaultBuildOptions,
  build: (
    target,
    {
      input: { files, code },
      output: { type, destination },
    } = defaultBuildOptions
  ) => {},
}

module.exports = {
  pure,
  parseFile: pure.parseFile(),
  parseCode: pure.parseCode(),
}
